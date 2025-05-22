# API
Este readme es una guia como utilizar la api en docker swarm

## Pasos previo
1. Descargar e instalar VirtualBox desde https://www.virtualbox.org/wiki/Downloads
2. Descargar e instalar Vagrant desde https://developer.hashicorp.com/vagrant/downloads
3. Ejecutar vagrant up para crear las 2 maquinas virtuales
4. Ejecutar
```
vagrant ssh servidorUbuntu
```
Para ingresar a las maquinas virtuales

## Clonar el repositorio
Dentro de la maquina servidorUbuntu clone este repositorio, asi
```
git clone https://github.com/BrayanTigreros/API-backend
```
Inicia swarm
```
vagrant@servidorUbuntu:~/API-backend$ sudo docker swarm init --advertise-addr 192.168.100.2
vagrant@servidorUbuntu:~/API-backend$ sudo docker stack deploy --compose-file docker-compose.yml back
vagrant@servidorUbuntu:~/API-backend$ sudo docker service ls
ID             NAME             MODE         REPLICAS   IMAGE                        PORTS
jvskbki3rxvb   back_envios      replicated   1/1        brayan333/envios:latest      *:3003->3003/tcp
ymna86ssbbag   back_garantias   replicated   1/1        brayan333/garantias:latest   *:3004->3004/tcp
5khtg5xl1kiq   back_mysql       replicated   0/1        mysql:8.0                    *:3306->3306/tcp
kp6sxmn7ly1g   back_productos   replicated   1/1        brayan333/productos:latest   *:3001->3001/tcp
i75ytjfosbfc   back_usuarios    replicated   1/1        brayan333/usuarios:latest    *:3002->3002/tcp
```
Puede escalar un servicio por ejemplo
```
vagrant@servidorUbuntu:~/API-backend$ sudo docker service scale back_usuarios=3
back_usuarios scaled to 3
overall progress: 3 out of 3 tasks
1/3: running   [==================================================>]
2/3: running   [==================================================>]
3/3: running   [==================================================>]
verify: Service back_usuarios converged
```
Puede confirmar con
```
vagrant@servidorUbuntu:~/API-backend$ sudo docker service ls
ID             NAME             MODE         REPLICAS   IMAGE                        PORTS
jvskbki3rxvb   back_envios      replicated   1/1        brayan333/envios:latest      *:3003->3003/tcp
ymna86ssbbag   back_garantias   replicated   1/1        brayan333/garantias:latest   *:3004->3004/tcp
5khtg5xl1kiq   back_mysql       replicated   1/1        mysql:8.0                    *:3306->3306/tcp
kp6sxmn7ly1g   back_productos   replicated   1/1        brayan333/productos:latest   *:3001->3001/tcp
i75ytjfosbfc   back_usuarios    replicated   3/3        brayan333/usuarios:latest    *:3002->3002/tcp
```
Por ejemplo prueba un microservicio con curl
```
vagrant@servidorUbuntu:~/API-backend$ curl 192.168.100.2:3002/usuarios
[]
```
Prueba agregando un usuario usando Postman https://www.postman.com/downloads/
```
{
    "nombre": "jose",
    "email": "jose@example.com",
    "usuario": "jose23",
    "password": "54321",
    "telefono": "31015555",
    "cedula": "12345",
    "direccion": "Colombia"
}
```







