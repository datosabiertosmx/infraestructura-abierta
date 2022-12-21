$(document).ready(function(){
    console.log(`Ready Menú`)
    // poryectos 
    $('#projects').click(function () {
        window.location.href = `/proyectos/`; 
        // window.location.href = `/proyectos/${$('#yearFilter').val()}/${$('#entityFilter').val()}/${$('#implementatorFilter').val()}`; 
    });
    // contrataciones
    $('#contractings').click(function () {
        window.location.href = `/contrataciones/`; 
//         window.location.href = `/contrataciones/${$('#yearFilter').val()}/${$('#entityFilter').val()}/${$('#implementatorFilter').val()}`; 
    });
    // contratista 
    $('#contractors').click(function () {
        window.location.href = `/contratistas/`; 
    });
    // instituciones 
    $('#institutions').click(function () {
        window.location.href = `/instituciones/`; 
        //window.location.href = `/instituciones/${$('#yearFilter').val()}/${$('#entityFilter').val()}/${$('#implementatorFilter').val()}`; 
    });
    // indicadores 
    $('#indicadores').click(function () {
        window.location.href = `/indicadores/`; 
    //     window.location.href = `/indicador/${$('#yearFilter').val()}/${$('#entityFilter').val()}/${$('#implementatorFilter').val()}`; 
    });
});
