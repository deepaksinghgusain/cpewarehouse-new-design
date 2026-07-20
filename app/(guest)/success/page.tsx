import SuccessMessage from './successMessage';

const delay = (ms: number) =>  new Promise((resolve) => setTimeout(resolve, ms));

const SuccessPage = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

  const { session_id } = await searchParams;

  return (
      <SuccessMessage session_id={session_id} />
  )
}

export default SuccessPage