require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer")
const Searches = require('./models/searches');
console.log(process.env.MAPBOX_KEY);

const main = async () => {

    console.clear()
    const searches = new Searches();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await searches.ciudad(termino);

                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);
                searches.agregarHistorial(lugarSel.nombre);
                // Clima
                const clima = await searches.climaLugar(lugarSel.lat, lugarSel.lng);

                // Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:'.green, `${lugarSel.nombre}`.white);
                console.log('Latitud:'.green, `${lugarSel.lat}`.white);
                console.log('Longitud:'.green, `${lugarSel.lng}`.white);
                console.log('Temperatura:'.green, `${clima.temp}`.white, '°C');
                console.log('Mínima:'.green, `${clima.min}`.white);
                console.log('Máxima:'.green, `${clima.max}`.white);
                console.log('Descripción:'.green, `${clima.desc}`.white);

                break;

            case 2:
                console.log('\nUltimas búsquedas:'.green);
                searches.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;

            case 0:
                console.log('\nGracias por usar la app. :)\n'.green);
                break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0)


}

main();

