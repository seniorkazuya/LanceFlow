import { redirect } from 'next/navigation';

export default function DeveloperSignUpPage() {
  redirect('/auth/signup?role=developer');
}
