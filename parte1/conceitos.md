# Conceitos

## 1. Diferença entre REST e GraphQL
REST normalmente usa vários endpoints, como por exemplo `/users`, `/tasks`, e cada um retorna um formato já definido.
Já no GraphQL você tem um endpoint só, e o cliente escolhe exatamente quais dados quer buscar.

## 2. O que é transação em banco de dados
Transação é quando você executa várias operações no banco garantindo que elas sejam tratadas como uma única unidade.

## 3. Diferença entre autenticação e autorização
- Autenticação valida quem você é (ex: login, token).
- Autorização é definir o que você pode fazer depois que já está autenticado, como exemplo podemos falar de alguma ação que o usuário pode fazer ou não.

## 4. Quando usar cache e quando evitar
Cache faz sentido quando você tem muita leitura de dados que não mudam com frequência.
Agora, se os dados mudam o tempo todo e você precisa de uma assertividade maior, cache não seria tão interessante.