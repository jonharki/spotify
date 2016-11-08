var spotify = (function () {


    var artistasFavoritos = [];
    var claveLocalStorage = 'artistasFavoritos';
    var albumes = [];
    var albumesDiferentes = [];
    var artistaId = null;
    var albumId = null;

    var buscadorDeArtistas = function () {

        var nombreArtista = $('#buscadorArtistas').val();

        $.ajax({
            url: "https://api.spotify.com/v1/search?type=artist&q=" + nombreArtista,
            crossDomain: true,
            dataType: "json"
        }).done(function (data) {

            // Si todo salio bien se ejecuta esto
            //console.log(data);
            console.log(data);
            for (i in data.artists.items) {
                var artista = data.artists.items[i];
                dibujarArtista(artista);

            }

        }).fail(function (jqXHR, textStatus) {

            // Si hubo algun problema se ejecuta esto
            console.log(textStatus);

        });
    };



    var dibujarArtista = function (artista) {

        $('<li/>').appendTo('#resultadoArtistas')
            .attr('id', artista.id);
        $('<h3/>').html(artista.name)
            .appendTo('#' + artista.id);
        var existe = ($.inArray(artista.id, artistasFavoritos));
        if (existe > -1) {
            $('<span/>').addClass('glyphicon glyphicon-star')
                .css('color', 'yellow')
                .appendTo('#' + artista.id + ' h3')
                .on('click', function () {
                    agregarFavorito(artista);
                    console.log(artistasFavoritos);
                });
        } else {
            $('<span/>').addClass('glyphicon glyphicon-star-empty')
                .css('color', 'yellow')
                .appendTo('#' + artista.id + ' h3')
                .on('click', function () {
                    agregarFavorito(artista);
                    console.log(artistasFavoritos);
                });
        };


        if (artista.images.length > 0) {
            $('<img>').attr('src', artista.images[0].url)
                .appendTo('#' + artista.id)
                .css('max-width', 250);
        };
    };

    var limpiarResultados = function () {
        $('#resultadoArtistas').empty();
    };

    var limpiarBuscador = function () {
        $('#buscadorArtistas').val('');
    };

    var agregarFavorito = function (artista) {

        var existe = ($.inArray(artista.id, artistasFavoritos));
        console.log(existe)
        if (existe < 0) {
            artistasFavoritos.push(artista.id);
            guardarFavoritos();
            $('#' + artista.id + ' span')
                .removeClass('glyphicon glyphicon-star-empty')
                .addClass('glyphicon glyphicon-star');
        } else {
            for (i = 0; i < artistasFavoritos.length; i++) {
                if (artistasFavoritos[i] === artista.id) {
                    artistasFavoritos.splice(i, 1);
                };
            };
            $('#' + artista.id + ' span')
                .removeClass('glyphicon glyphicon-star')
                .addClass('glyphicon glyphicon-star-empty');
        };
    };

    var removerFavorito = function (artista) {

        $('#' + artista.id + ' span')
            .removeClass('glyphicon glyphicon-star')
            .addClass('glyphicon glyphicon-star-empty');
        $('#' + artistaFavorito.id + 'li').remove();
    };

    var vincularSolapas = function () {

        $('#linkFavoritos').on('click', function () {
            $(this).parent().addClass('active');
            $('#linkBuscador').parent().removeClass('active');
            $('#pestaniaBuscador').addClass('hidden');
            $('#pestaniaFavoritos').removeClass('hidden');
            cargarArtistasFavoritos();//dibujarArtistaFavorito();

        });

        $('#linkBuscador').on('click', function () {

            $(this).parent().addClass('active');

            $('#linkFavoritos').parent().removeClass('active');
            $('#pestaniaBuscador').removeClass('hidden');//me vuelve a dibujar al artista favorito
            $('#pestaniaFavoritos').addClass('hidden');
            $('#resultadoFavoritos').empty();
        });
    };

    var dibujarArtistaFavorito = function (artista) {

        $('<li/>').appendTo('#resultadoFavoritos')
            .attr('id', 'f_' + artista.id);
        $('<h3/>').html(artista.name)
            .appendTo('#' + 'f_' + artista.id);
        $('<span/>').addClass('glyphicon glyphicon-remove')
            .appendTo('#' + 'f_' + artista.id + ' h3')
            .on('click', function () {
                borrarFavoritoDOM(artista.id);
                $('#' + artista.id + ' span')
                    .removeClass('glyphicon glyphicon-star')
                    .addClass('glyphicon glyphicon-star-empty');
                // artistasFavoritos.push(artista);
                for (i = 0; i < artistasFavoritos.length; i++) {
                    if (artistasFavoritos[i] === artista.id) {
                        artistasFavoritos.splice(i, 1);
                    };
                };
                guardarFavoritos();
            });
        if (artista.images.length > 0) {
            $('<img>').attr('src', artista.images[0].url)
                .appendTo('#' + 'f_' + artista.id)
                .css('max-width', 250);
        };
        $('<div/>').appendTo('#' + 'f_' + artista.id)
        /*.attr('#' + 'l_' + artista.id), */

        $('<button/>').addClass('btn btn-primary')
            .html('albumes')
            .attr('id', 'b_' + artista.id)
            .appendTo('#' + 'f_' + artista.id)
            .on('click', function () {
                artistaId = artista.id;
                $('<li/>').appendTo('#' + 'f_' + artista.id)
                    .attr('id', 'l_' + artista.id);
                $('<H3/>').html('lista de albumes')
                    .appendTo('#' + 'l_' + artista.id);
                buscadorDeAlbumes();

                $('#b_' + artista.id).off('click')
                /*$('#b_'+ artista.id).on('click', function(){
                    $('#l_' + artista.id).remove();
                    
                })*/

                console.log(artistaId)

            })

    };

    var borrarFavoritoDOM = function (id) {

        $('#f_' + id).fadeOut("slow");
    };

    var cargarArtistasFavoritos = function () {

        for (i in artistasFavoritos) {

            $.ajax({
                url: "https://api.spotify.com/v1/artists?ids=" + artistasFavoritos[i],
                crossDomain: true,
                dataType: "json"
            }).done(function (data) {
                console.log(data);
                for (i in data.artists) {
                    var artista = data.artists[i];
                    dibujarArtistaFavorito(artista);
                };

            }).fail(function (jqXHR, textStatus) {

                // Si hubo algun problema se ejecuta esto
                console.log(textStatus);

            });
        };
    };

    var guardarFavoritos = function () {

        var datos = JSON.stringify(artistasFavoritos);
        localStorage.setItem(claveLocalStorage, datos);

    };

    var precargarFavoritos = function () {

        var datos = localStorage.getItem(claveLocalStorage);

        if (datos !== null && datos != []) {

            artistasFavoritos = JSON.parse(datos);

            //   for (let i = 0; i < artistasFavoritos.length; i++) {

            //     dibujarArtistaFavorito(artista);

            //   }

        }

    }

    var buscadorDeAlbumes = function () {

        // idArtista=(artistasFavoritos[0])

        $.ajax({
            url: "https://api.spotify.com/v1/artists/" + artistaId + "/albums?album_type=album&market=AR",
            crossDomain: true,
            dataType: "json"
        }).done(function (data) {

            // Si todo salio bien se ejecuta esto
            //console.log(data);
            console.log(data);
            for (i in data.items) {
                var album = data.items[i];
                // albumes.push(data.items[i]);
                // console.log(albumes)
                dibujarAlbum(album);

            }

        }).fail(function (jqXHR, textStatus) {

            // Si hubo algun problema se ejecuta esto
            console.log(textStatus);

        });
    };

    var buscarAlbumCompleto = function () {

        $.ajax({
            url: "https://api.spotify.com/v1/albums/" + albumId,
            crossDomain: true,
            dataType: "json"
        }).done(function (data) {

            // Si todo salio bien se ejecuta esto
            //console.log(data);
            console.log(data);
            
            albumModal(data);


            //}

        }).fail(function (jqXHR, textStatus) {

            // Si hubo algun problema se ejecuta esto
            console.log(textStatus);

        });
    };



    var dibujarAlbum = function (album) {
        $('<li/>').attr('id', album.id)
            .appendTo('#' + "l_" + artistaId)
            .html(album.name)
            .on('click', function () {
                albumId = album.id;
                buscarAlbumCompleto();
                $("#dialogDetalleAlbum").modal('show');
            })

        console.log(artistaId)
        /* for (i in albumes) {
             if (albumes[i].name !== albumesDiferentes.name){
                 albumesDiferentes.push[albumes[i]]
                 console.log(albumesDiferentes)    
         } */

    };

    var albumModal = function (data) {
        var canciones = data.tracks.items;
        
        
        $('#dialogDetalleAlbum .modal-body').empty();
        $('<img/>').attr('src', data.images[0].url)
            .css('max-width', 200)
            .css('display', 'block')
            .css('margin', '0 auto')
            .appendTo('#dialogDetalleAlbum .modal-body');

        $('h4' + '.modal-title').html(data.name);
        $('<p/>').html(moment(data.release_date).format('DD/MM/YYYY'))
            .appendTo('h4' + '.modal-title');
        
        $('<ul/>').attr('id', 'listadoDeCanciones')
            .appendTo('#dialogDetalleAlbum .modal-body')
        $('.close').on('click', reproducirAudio());    
        // Recorremos las canciones del album 
        // y las agregamos al ul
        for (i = 0; i < canciones.length; i++) {

            $('<li/>').attr('id', canciones[i].id)
                .appendTo('#listadoDeCanciones')
            $('<a/>').html(canciones[i].track_number + ' ' + canciones[i].name + ' ' + moment(canciones[i].duration_ms).format('mm:ss'))
                .on('click', reproducirAudio(canciones[i].preview_url))
                .appendTo('#' + canciones[i].id);

        }

        $('<iframe/>')
            .addClass('hidden')
            .appendTo('#dialogDetalleAlbum .modal-body');

    }
    
    // Closure
    var reproducirAudio = function(url) { 

        return function () { 
            $('iframe')
                .removeClass('hidden')
                .attr('src', url);

        }
        
    }

    var ejecutarComportamiento = reproducirAudio('http://');

    var vincularDOM = function () {

        $('#buscarArtistas').on('click', limpiarResultados)
            .on('click', buscadorDeArtistas)
            .on('click', limpiarBuscador)
        $('#buscadorArtistas').keyup(function (event) {
            if (event.keyCode == 13) {
                $("#buscarArtistas").click();
            };
        });


    };


    var iniciar = function () {
        vincularSolapas();
        //recuperarArtistas()
        vincularDOM();
        precargarFavoritos();
    };

    return {
        // agregarArtista:agregarArtista,
        // quitarArista:quitarArista,
        // ordenarId:ordenarId,
        // ordenarTitulo:ordenarTitulo,
        // obtenerArtistas: obtenerArtistas,
        iniciar: iniciar
    };


})()

$(document).ready(function () {

    spotify.iniciar();

});

