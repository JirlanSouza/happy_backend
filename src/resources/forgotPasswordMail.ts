interface Context {
    name: string;
    linkResetPassword: string;
}

export default function mailHtml(context: Context) {
    return (

        `<h1>Olá ${ context.name } recebemos a sua solicitação de recuperação de senha</h1><br><hr/><a href="${ context.linkResetPassword }">Clique aqui e acesso a página de recuperação de senha</a>`
    )
}