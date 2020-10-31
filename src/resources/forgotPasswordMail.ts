interface Context {
    name: string;
    forgotToken: string;
}

export default function mailHtml(context: Context) {
    return (

        `<h1>Solicitação de resete de senha</h1><br><a>Utilize este tokem ${ context.forgotToken }</a>`
    )
}