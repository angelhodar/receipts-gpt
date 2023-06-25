export default function Receipt({ params }: { params: { id: string } }) {
  return <div>My receipt: {params.id}</div>
}
