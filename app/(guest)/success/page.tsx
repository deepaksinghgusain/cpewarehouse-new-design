import { getOrderBySessinId } from '@/services/course';
import Link from 'next/link';
import SuccessMessage from './successMessage';

const delay = (ms: number) =>  new Promise((resolve) => setTimeout(resolve, ms));

const SuccessPage = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

  let title = ""
  let itemsArray: any = []

  const { session_id } = await searchParams;
  console.log("Session ID from search params:", session_id);

  await delay(2000)

  return (
      <SuccessMessage session_id={session_id} />
  )
}

export default SuccessPage