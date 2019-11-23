import create from './create';
import edit from './edit';
import show from './show';
import deleteU from './delete';

export default {
    create: create,
    edit: edit,
    show: show,
    delete: deleteU,
    filterBy: 'Filtrar por: ',
    header: {
        name: 'Nombre',
        lastName: 'Apellido',
        company: 'Empresa',
        email: 'Correo Electrónico',
        capabilities: 'Capacidad',
        edit: 'Editar',
        details: 'Detalles',
        moreInfo: 'Más información ...'
    },
    moreDetails:{
        creationDate: 'Fecha de creación',
        jobTitle: 'Cargo',
        country: 'País',
        gender: 'Género'
    },
    deleteUser: {
        sure: '¿Estás seguro?',
        content: `Eliminará {cant} usuario{plural}. <br> ¡No podrá revertir esto!`,
        confirm: 'Sí, comprendo.',
        cancel: '¡No!, cancelalo.',
        title: 'Eliminación exitosa',
        contentFinal: `Los usuarios <strong>{users}</strong> ya no existen.`,
        titleCancel: 'Cancelado',
        contentCancel: 'Los usuarios están seguros :)'
    },
    unselect: 'Deseleccionar todo',
    male: 'Masculino',
    female: 'Femenino',
    empty: 'No existe el usuario'
}