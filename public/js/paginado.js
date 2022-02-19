let enlaces = document.querySelectorAll(".contenedorEnlaces a");
let loQueBuscoElUsuario = location.search;
let palabraBuscada = new URLSearchParams(location.search)
let contador = 1;
for(let unEnlace of enlaces)
{
    unEnlace.setAttribute("href", ('?busqueda='+ palabraBuscada.get("busqueda") +'&pagina='+contador));
    contador++;
}