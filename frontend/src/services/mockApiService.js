// src/services/mockApiService.js

const mockDatabase = {
  indicadores: [
    { id: '1', nombre: 'Tasa de Satisfacción del Cliente', tipo: 'manual', descripcion: 'Mide el nivel de satisfacción de los clientes con nuestros productos y servicios.', meta: '> 95%', frecuencia: 'Trimestral', responsable: 'Gerente de Calidad' },
    { id: '2', nombre: 'Tiempo de Resolución de Incidencias', tipo: 'manual', descripcion: 'Tiempo promedio para resolver las incidencias reportadas por los clientes.', meta: '< 24 horas', frecuencia: 'Mensual', responsable: 'Jefe de Soporte' },
    { id: '3', nombre: 'Porcentaje de Cumplimiento de Entregas', tipo: 'manual', descripcion: 'Porcentaje de pedidos entregados en la fecha y hora acordadas.', meta: '> 99%', frecuencia: 'Semanal', responsable: 'Jefe de Logística' },
    { id: '4', nombre: 'Total de Procesos Activos', tipo: 'calculado', descripcion: 'Cantidad total de procesos documentados y activos en el sistema.', origen: 'procesos', calculo: 'count' },
  ],
  mediciones: [
    { id: 'm1', indicadorId: '1', valor: '96%', fecha: '2023-03-31' },
    { id: 'm2', indicadorId: '1', valor: '97%', fecha: '2023-06-30' },
    { id: 'm3', indicadorId: '2', valor: '22 horas', fecha: '2023-05-31' },
  ],
};

const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));

class MockApiService {
  constructor(delay = 500) {
    this.delay = delay;
  }

  async request(resource, operation, params) {
    await sleep(this.delay);
    console.log(`[MOCK API] ${operation.toUpperCase()} ${resource}`, params);

    if (!mockDatabase[resource]) {
      throw new Error(`El recurso mock '${resource}' no existe.`);
    }

    let result;
    const resourceData = mockDatabase[resource];

    switch (operation) {
      case 'get_all':
        if (params && params.filterKey) {
          result = resourceData.filter(item => item[params.filterKey] === params.filterId);
        } else {
          result = [...resourceData];
        }
        break;
      
      case 'get_by_id':
        result = resourceData.find(item => item.id === params.id);
        if (!result) throw new Error(`Elemento con id ${params.id} no encontrado en ${resource}.`);
        break;

      case 'create':
        const newItem = { ...params.data, id: Date.now().toString() };
        resourceData.push(newItem);
        result = newItem;
        break;

      case 'update':
        const index = resourceData.findIndex(item => item.id === params.id);
        if (index === -1) throw new Error(`Elemento con id ${params.id} no encontrado para actualizar.`);
        resourceData[index] = { ...resourceData[index], ...params.data };
        result = resourceData[index];
        break;

      case 'delete':
        const deleteIndex = resourceData.findIndex(item => item.id === params.id);
        if (deleteIndex === -1) throw new Error(`Elemento con id ${params.id} no encontrado para eliminar.`);
        resourceData.splice(deleteIndex, 1);
        result = { success: true };
        break;

      default:
        throw new Error(`Operación mock '${operation}' no soportada.`);
    }
    
    console.log(`[MOCK API] Response:`, result);
    return result;
  }

  get(endpoint) {
    const url = new URL(endpoint, 'http://mock.api');
    const [, resource, id] = url.pathname.split('/');
    
    if (id) {
      return this.request(resource, 'get_by_id', { id });
    }

    const queryParams = Object.fromEntries(url.searchParams.entries());
    const filterKey = Object.keys(queryParams)[0];

    if (filterKey) {
      const filterId = queryParams[filterKey];
      if (mockDatabase[resource]?.[0]?.hasOwnProperty(filterKey)) {
        return this.request(resource, 'get_all', { filterKey, filterId });
      }
    }
    
    return this.request(resource, 'get_all');
  }
  
  post(endpoint, data) {
    const [, resource] = endpoint.split('/');
    return this.request(resource, 'create', { data });
  }

  put(endpoint, data) {
    const [, resource, id] = endpoint.split('/');
    return this.request(resource, 'update', { id, data });
  }

  delete(endpoint) {
    const [, resource, id] = endpoint.split('/');
    return this.request(resource, 'delete', { id });
  }
}

const masterMockApiService = new MockApiService();

export const createMockApiClient = (baseRoute) => {
  return {
    get: (specificEndpoint = '') => masterMockApiService.get(`${baseRoute}${specificEndpoint}`),
    post: (specificEndpoint = '', data) => masterMockApiService.post(`${baseRoute}${specificEndpoint}`, data),
    put: (specificEndpoint = '', data) => masterMockApiService.put(`${baseRoute}${specificEndpoint}`, data),
    delete: (specificEndpoint = '') => masterMockApiService.delete(`${baseRoute}${specificEndpoint}`),
  };
};
