create database rinku;

go

use rinku;

go

create table Usuarios
(
    id int not null AUTO_INCREMENT,
    nombreUsuario varchar(50) not null default '',
    contrasena varchar(50) not null default '',
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    primary key(id)
);

create table Rol
(
    id int not null AUTO_INCREMENT,
    nombreRol varchar(50) not null default '',
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null ,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,

    primary key(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);


create table TipoEmpleado
(
    id int not null AUTO_INCREMENT,
    tipoEmpleado varchar(50) not null default '',
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null ,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);

create table JornadaLaboral
(
    id int not null AUTO_INCREMENT,
    horasLaborales int not null default 8,
    sueldoBase decimal not null default 0.0,
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null ,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);

create table Empleado
(
    id int not null AUTO_INCREMENT,
    nombre varchar(50) not null default '',
    apellidoPaterno varchar(50) not null default '',
    apellidoMaterno varchar(50) not null default '',
    fechaNacimiento datetime not null,
    domicilio varchar(50) null default '',
    tipoEmpleadoId int not null default 0,
    rolId int not null default 0,
    jornadaLaboralId int not null default 0,
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(tipoEmpleadoId) references TipoEmpleado(id),
    foreign key(rolId) references Rol(id),
    foreign key(jornadaLaboralId) references JornadaLaboral(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);

create table MovimientoEmpleado
(
    id int not null AUTO_INCREMENT,
    empleadoId int not null default 0,
    cantidadEntregasRecorrido int null default 0,
    tipoRolCubirtoId int null default 0,
    fechaMovimiento datetime not null default now(),
    importeTotalRecorrido decimal null default 0.0,
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(empleadoId) references Empleado(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);

create table TipoBono
(
    id int not null AUTO_INCREMENT,
    nombreBono varchar(50) not null default '',
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);

create table Bono
(
    id int not null AUTO_INCREMENT,
    importe decimal not null default 0.0,
    tipoBonoId int not null default 0,
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(tipoBonoId) references TipoBono(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);

create table Configuraciones
(
    id int not null AUTO_INCREMENT,
    nombre varchar(50) not null default '',
    porcentaje int not null default 0,
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null ,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);

create table Sesion
(
    id int not null AUTO_INCREMENT,
    token varchar(500) not null default '',
    activo bit not null default 1,
    fechaCreacion datetime not null default now(),
    usuarioCreacionId int not null ,
    fechaModificacion datetime null default null,
    usuarioModificacionId int not null default 0,
    primary key(id),
    foreign key(usuarioCreacionId) references Usuarios(id)
);



insert into Usuarios(nombreUsuario,contrasena) values('Denisse','81dc9bdb52d04dc20036dbd8313ed055');
insert into JornadaLaboral(horasLaborales,sueldoBase,usuarioCreacionId,usuarioModificacionId) values(8,240,1,1);
insert into TipoBono(nombreBono,usuarioCreacionId,usuarioModificacionId) values('BonoPorEntrega',1,1);
insert into TipoBono(nombreBono,usuarioCreacionId,usuarioModificacionId) values('BonoPorChofer',1,1);
insert into TipoBono(nombreBono,usuarioCreacionId,usuarioModificacionId) values('BonoPorCargador',1,1);
insert into Bono(importe,tipoBonoId,usuarioCreacionId,usuarioModificacionId) values(5,(select id from TipoBono where nombreBono = 'BonoPorEntrega'),1,1);
insert into Bono(importe,tipoBonoId,usuarioCreacionId,usuarioModificacionId) values(10,(select id from TipoBono where nombreBono = 'BonoPorChofer'),1,1);
insert into Bono(importe,tipoBonoId,usuarioCreacionId,usuarioModificacionId) values(5,(select id from TipoBono where nombreBono = 'BonoPorCargador'),1,1);
insert into Configuraciones(nombre,porcentaje,usuarioCreacionId,usuarioModificacionId) values('ISR',9,1,1);
insert into Configuraciones(nombre,porcentaje,usuarioCreacionId,usuarioModificacionId) values('ISRAdicional',3,1,1);
insert into Configuraciones(nombre,porcentaje,usuarioCreacionId,usuarioModificacionId) values('ValeDespensa',4,1,1);


insert into TipoEmpleado(tipoEmpleado,usuarioCreacionId) values('Interno',1);
insert into TipoEmpleado(tipoEmpleado,usuarioCreacionId) values('Subcontratados',1);
insert into Rol(nombreRol,usuarioCreacionId) values('Chofer',1);
insert into Rol(nombreRol,usuarioCreacionId) values('Cargador',1);
insert into Rol(nombreRol,usuarioCreacionId) values('Auxiliar',1);
