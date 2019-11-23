export default {
    title: 'CONTRATOS DE TRAVELMAX',
    filterOwner: 'Dueño del contrato',
    filterCode : 'Código del contrato',
    iata: {
        label: 'IATA perteneciente',
        ph: 'PERU',
        both: 'AMBOS'
    },
    select: 'Deseleccionar todo',
    table: {
        iata: 'IATA',
        owner: 'Dueño',
        code: 'Código',
        author: 'Autor',
        edit: 'Editar',
        details: 'Detalles',
        moreInfo: {
            title: 'Más información ...',
            visibility: 'Está disponible para esta clase de agentes: ',
            dates: 'El contrato fue creado en {creation} y es válido desde el {start} al {end}.',
            logs: 'Revisar últimas actualizaciones'
        },
        expire: 'Dias a expirar',
        days: 'días',
        empty: 'El contrato no existe'
    },
    logs: {
        title: `Registro de cambios`,
        table: {
            subject: 'Asunto',
            description: 'Descripción',
            user: 'Usario',
            date: 'Fecha',
            logs: 'Cambios'
        }
    }
}