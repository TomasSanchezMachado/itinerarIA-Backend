export class Usuario {
    constructor(nombreDeUsuario, //Hay que crear un tipo para el nombre de usuario
    nombres, apellidos, fechaNacimiento, mail, nroTelefono, itinerarios, 
    //public opiniones: Array<Opinion>,
    id // crypto.randomUUID()
    ) {
        this.nombreDeUsuario = nombreDeUsuario;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.fechaNacimiento = fechaNacimiento;
        this.mail = mail;
        this.nroTelefono = nroTelefono;
        this.itinerarios = itinerarios;
        this.id = id;
    }
}
//# sourceMappingURL=usuario.entity.js.map