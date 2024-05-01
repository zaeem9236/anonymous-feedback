export async function POST(request: Request){
    return Response.json(
        {message: 'ok'},
        {status: 200 }
    )
}