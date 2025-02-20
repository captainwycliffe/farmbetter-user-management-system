import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class WebhookService {
  private firestore: FirebaseFirestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }

  async storeMessage(phone: string, message: string): Promise<void> {
    const messagesRef = this.firestore.collection('messages');
    await messagesRef.add({
      phone,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  listenForMessages(callback: (data: any) => void): void {
    this.firestore.collection('messages').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          callback(change.doc.data());
        }
      });
    });
  }
}
