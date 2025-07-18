// Script para agregar personal de muestra a la base de datos
import { createClient } from '@libsql/client';

const client = createClient({
  url: "libsql://iso-muestra-104-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY3OTgzMTUsImlkIjoiYjM2Y2MxYzYtY2I0NC00NzFkLWEyYjYtNGI5MTI0NjQ2MmE4IiwicmlkIjoiZDIyMDRlMGQtMTcxYy00NjhkLTliODUtYzNhYTYzNDlhZmI0In0.6FSA-ozXSMWU5XtSgul4oNQ6nzhA42IyX9emolZusfrO4aGP6xvn0p7cHmBHRtpwlTSxX4Tq-UVWaX5QUtdzAw"
});

const personalData = [
  {
    id: 'per-001',
    nombres: 'Juan Carlos',
    apellidos: 'González',
    email: 'juan.gonzalez@empresa.com',
    telefono: '+54 11 1234-5678',
    documento_identidad: 'DNI 12345678',
    fecha_nacimiento: '1985-03-15',
    nacionalidad: 'Argentina',
    direccion: 'Av. Corrientes 1234, CABA',
    telefono_emergencia: '+54 11 9876-5432',
    fecha_contratacion: '2020-01-15',
    numero_legajo: 'LEG-001',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-002',
    nombres: 'María Elena',
    apellidos: 'Rodríguez',
    email: 'maria.rodriguez@empresa.com',
    telefono: '+54 11 2345-6789',
    documento_identidad: 'DNI 23456789',
    fecha_nacimiento: '1990-07-22',
    nacionalidad: 'Argentina',
    direccion: 'Belgrano 567, CABA',
    telefono_emergencia: '+54 11 8765-4321',
    fecha_contratacion: '2019-06-10',
    numero_legajo: 'LEG-002',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-003',
    nombres: 'Carlos Alberto',
    apellidos: 'López',
    email: 'carlos.lopez@empresa.com',
    telefono: '+54 11 3456-7890',
    documento_identidad: 'DNI 34567890',
    fecha_nacimiento: '1988-11-08',
    nacionalidad: 'Argentina',
    direccion: 'Palermo 890, CABA',
    telefono_emergencia: '+54 11 7654-3210',
    fecha_contratacion: '2021-03-20',
    numero_legajo: 'LEG-003',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-004',
    nombres: 'Ana Sofía',
    apellidos: 'Martínez',
    email: 'ana.martinez@empresa.com',
    telefono: '+54 11 4567-8901',
    documento_identidad: 'DNI 45678901',
    fecha_nacimiento: '1992-04-12',
    nacionalidad: 'Argentina',
    direccion: 'Recoleta 234, CABA',
    telefono_emergencia: '+54 11 6543-2109',
    fecha_contratacion: '2020-09-05',
    numero_legajo: 'LEG-004',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-005',
    nombres: 'Luis Miguel',
    apellidos: 'Fernández',
    email: 'luis.fernandez@empresa.com',
    telefono: '+54 11 5678-9012',
    documento_identidad: 'DNI 56789012',
    fecha_nacimiento: '1987-12-03',
    nacionalidad: 'Argentina',
    direccion: 'San Telmo 456, CABA',
    telefono_emergencia: '+54 11 5432-1098',
    fecha_contratacion: '2018-11-15',
    numero_legajo: 'LEG-005',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-006',
    nombres: 'Patricia Beatriz',
    apellidos: 'García',
    email: 'patricia.garcia@empresa.com',
    telefono: '+54 11 6789-0123',
    documento_identidad: 'DNI 67890123',
    fecha_nacimiento: '1986-08-25',
    nacionalidad: 'Argentina',
    direccion: 'Villa Crespo 789, CABA',
    telefono_emergencia: '+54 11 4321-0987',
    fecha_contratacion: '2019-02-28',
    numero_legajo: 'LEG-006',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-007',
    nombres: 'Roberto Daniel',
    apellidos: 'Silva',
    email: 'roberto.silva@empresa.com',
    telefono: '+54 11 7890-1234',
    documento_identidad: 'DNI 78901234',
    fecha_nacimiento: '1984-05-18',
    nacionalidad: 'Argentina',
    direccion: 'Caballito 321, CABA',
    telefono_emergencia: '+54 11 3210-9876',
    fecha_contratacion: '2017-07-12',
    numero_legajo: 'LEG-007',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-008',
    nombres: 'Silvia Marcela',
    apellidos: 'Torres',
    email: 'silvia.torres@empresa.com',
    telefono: '+54 11 8901-2345',
    documento_identidad: 'DNI 89012345',
    fecha_nacimiento: '1989-01-30',
    nacionalidad: 'Argentina',
    direccion: 'Almagro 654, CABA',
    telefono_emergencia: '+54 11 2109-8765',
    fecha_contratacion: '2021-01-08',
    numero_legajo: 'LEG-008',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-009',
    nombres: 'Diego Alejandro',
    apellidos: 'Morales',
    email: 'diego.morales@empresa.com',
    telefono: '+54 11 9012-3456',
    documento_identidad: 'DNI 90123456',
    fecha_nacimiento: '1991-09-14',
    nacionalidad: 'Argentina',
    direccion: 'Boedo 987, CABA',
    telefono_emergencia: '+54 11 1098-7654',
    fecha_contratacion: '2020-04-22',
    numero_legajo: 'LEG-009',
    estado: 'Activo',
    organization_id: 1
  },
  {
    id: 'per-010',
    nombres: 'Laura Cecilia',
    apellidos: 'Herrera',
    email: 'laura.herrera@empresa.com',
    telefono: '+54 11 0123-4567',
    documento_identidad: 'DNI 01234567',
    fecha_nacimiento: '1993-06-07',
    nacionalidad: 'Argentina',
    direccion: 'Parque Patricios 147, CABA',
    telefono_emergencia: '+54 11 0987-6543',
    fecha_contratacion: '2022-03-15',
    numero_legajo: 'LEG-010',
    estado: 'Activo',
    organization_id: 1
  }
];

async function insertPersonal() {
  try {
    console.log('🚀 Iniciando inserción de personal...');
    
    for (const persona of personalData) {
      const timestamp = new Date().toISOString();
      
      await client.execute({
        sql: `
          INSERT INTO personal (
            id, nombres, apellidos, email, telefono, documento_identidad,
            fecha_nacimiento, nacionalidad, direccion, telefono_emergencia,
            fecha_contratacion, numero_legajo, estado, organization_id,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          persona.id,
          persona.nombres,
          persona.apellidos,
          persona.email,
          persona.telefono,
          persona.documento_identidad,
          persona.fecha_nacimiento,
          persona.nacionalidad,
          persona.direccion,
          persona.telefono_emergencia,
          persona.fecha_contratacion,
          persona.numero_legajo,
          persona.estado,
          persona.organization_id,
          timestamp,
          timestamp
        ]
      });
      
      console.log(`✅ Personal insertado: ${persona.nombres} ${persona.apellidos}`);
    }
    
    console.log('🎉 Inserción de personal completada exitosamente');
    
    // Verificar la inserción
    const result = await client.execute({
      sql: 'SELECT COUNT(*) as total FROM personal WHERE organization_id = 1'
    });
    
    console.log(`📊 Total de personal en la organización: ${result.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error insertando personal:', error);
  }
}

insertPersonal(); 