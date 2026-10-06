import SuccessMessage from './successMessage';

const delay = (ms: number) =>  new Promise((resolve) => setTimeout(resolve, ms));

const SuccessPage = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

  const { session_id , orderId } = await searchParams;

  return (
      <SuccessMessage session_id={session_id} orderFreeId={orderId} />
  )
}

export default SuccessPage