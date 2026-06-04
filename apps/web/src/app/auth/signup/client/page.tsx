import { redirect } from 'next/navigation';

export default function ClientSignUpPage() {
  redirect('/auth/signup?role=client');
}
