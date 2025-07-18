describe('Pruebas de Autenticación', () => {
  beforeEach(() => {
    // Visitar la página de login antes de cada prueba
    cy.visit('/login');
    // Esperar a que el formulario esté completamente cargado
    cy.get('form').should('be.visible');
  });

  it('Debe mostrar el formulario de login', () => {
    // Verificar elementos del formulario usando el texto de las etiquetas
    cy.contains('label', 'Correo Electrónico').should('be.visible');
    cy.contains('label', 'Contraseña').should('be.visible');
    cy.contains('button', 'Iniciar Sesión').should('be.visible');
  });

  it('Debe iniciar sesión con credenciales válidas', () => {
    // Usar el placeholder para identificar el campo de email
    cy.get('input[placeholder="tu@email.com"]').type('admin@demo.com');
    // Usar el placeholder para identificar el campo de contraseña
    cy.get('input[placeholder="••••••••"]').type('admin123');
    // Usar el texto del botón para identificarlo
    cy.contains('button', 'Iniciar Sesión').click();

    // Esperar redirección y mensaje de éxito
    cy.url().should('include', '/departamentos', { timeout: 10000 });
  });

  it('Debe mostrar error con credenciales inválidas', () => {
    cy.get('input[placeholder="tu@email.com"]').type('usuario@invalido.com');
    cy.get('input[placeholder="••••••••"]').type('contraseñaincorrecta');
    cy.contains('button', 'Iniciar Sesión').click();

    // Esperar y verificar mensaje de error en el contenedor de error
    cy.get('.bg-red-100.text-red-700', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Credenciales incorrectas');
    
    // Verificar que permanecemos en la página de login
    cy.url().should('include', '/login');
  });
});
