export default {
    navigation: {
        left:'Anterior', 
        right: 'Siguiente'
    },
    steps: {
        0: {
            label: 'Información básica',
            owner: 'Dueño del contrato',
            code: 'Código del contrato',
            iata: 'IATA pertenciente',
            preview: 'Vista previa',
            logo: 'Arrastra o haz click para subir el logo',
            iataPh: 'PERU',
            visibility: 'Visibilidad',
            dates: 'Fechas validas',
            datesValid: 'Este contrato será valido por {days} día{s}',
            upload: 'Subir el contrato (PDF)',
            submit: 'Guardar',
            empty: 'No hay resultados para {input}'
        },
        1: {
            label: 'Zonas',
            editRegion: {
                label: 'Regiones',
                newRegion: 'Nueva Región',
                name: 'Nombre de región',
                region: 'Es región',
                country: 'Es país',
                continent: 'Es continente',
                group: 'Es grupo',
                airports: 'Aeropuertos',
                airportsE: 'Aeropuertos excluídos',
                countries: 'Países',
                countriesE: 'Países excluídos',
                continents: 'Continentes',
                continentE: 'Continentes excluídos',
                airportPH: 'LIM',
                addNewAirport: 'Agregar nuevo ...',
                duplicated: 'Este nombre de region ya está siendo usado.',
                noResult: 'No hay resultados para {input}',
                showAll: 'Ver todos',
                showLess: 'Ocultar todos',
                zero: 'No habrá regions para este contrato.',
                addnewRegion: 'Agregar nueva región',
                save: 'Guardar'
            },
            zero: 'Debe haber almenos una zona para este contrato.'
        },
        2: {
            label: 'Terminar',
            title: '¡Casi terminas!',
            help: 'Por favor, completa estos campos conciso y detallado para documentar tus cambios.',
            subject: 'Tema',
            description: 'Descripción',
            submit: 'Enviar'
        }
    },
    errors: {
        emptyField: 'Por favor, completa este campo.',
        duplicated: 'Este código de contrato ya está siendo usado.',
        country: 'Por favor, seleccione un país válido.',
        continent: 'Por favor, seleccione un continente válido.',
        group: 'Por favor, seleccione al menos 1 continente.',
        checkField: 'Por favor, revisa los campos',
        save: 'Por favor, guarda antes de avanzar'
    },
    confirm: {
        success: '¡Campos guardados!'
    }
}