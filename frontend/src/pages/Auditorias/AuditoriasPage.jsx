import React from 'react';
import AuditoriasListing from '../../components/auditorias/AuditoriasListing.jsx';

// ===============================================
// PÁGINA PRINCIPAL DE AUDITORÍAS - SGC PRO
// ===============================================

const AuditoriasPage = () => {
  return (
    <div className="min-h-screen bg-sgc-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AuditoriasListing />
      </div>
    </div>
  );
};

export default AuditoriasPage; 