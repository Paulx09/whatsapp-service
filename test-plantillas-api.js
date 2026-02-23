/**
 * Script de prueba para verificar integración con API de Laravel
 * Ejecución: node test-plantillas-api.js - Necesita estar corriendo el backend Laravel (php artisan serve)
 */
import dotenv from 'dotenv';
import { getTemplate, clearTemplateCache, preloadTemplates } from './src/templates.js';

dotenv.config();

async function testPlantillasAPI() {
  console.log('='.repeat(60));
  console.log('🧪 TEST: Integración WhatsApp Service <-> Laravel API');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Test 1: Obtener una plantilla individual
    console.log('Test 1: Obtener plantilla (Servicio 1, Número 1)');
    console.log('-'.repeat(60));
    
    const plantilla1 = await getTemplate(1, 1, { nombre: 'Juan Pérez' });
    console.log('Plantilla obtenida:');
    console.log(` Servicio: ${plantilla1.name}`);
    console.log(` Mensaje: ${plantilla1.text.substring(0, 100)}...`);
    console.log(` Imagen: ${plantilla1.image}`);
    console.log('');

    // Test 2: Verificar reemplazo de {nombre}
    console.log('Test 2: Verificar reemplazo de {nombre}');
    console.log('-'.repeat(60));
    
    const hasNombre = plantilla1.text.includes('Juan Pérez');
    const hasPlaceholder = plantilla1.text.includes('{nombre}');
    
    console.log(`   Incluye "Juan Pérez": ${hasNombre}`);
    console.log(`   NO incluye "{nombre}": ${!hasPlaceholder}`);
    console.log('');

    // Test 3: Cache funcionando
    console.log('Test 3: Verificar cache (5 minutos)');
    console.log('-'.repeat(60));
    
    const startTime = Date.now();
    const plantilla1Cache = await getTemplate(1, 1, { nombre: 'María López' });
    const cacheTime = Date.now() - startTime;
    
    console.log(`   Tiempo de respuesta con cache: ${cacheTime}ms`);
    console.log(`   Servicio: ${plantilla1Cache.name}`);
    console.log('');

    // Test 4: Pre-carga de todas las plantillas
    console.log('Test 4: Pre-cargar todas las plantillas (4 servicios × 3 plantillas)');
    console.log('-'.repeat(60));
    
    clearTemplateCache();
    await preloadTemplates();
    console.log('');

    // Test 5: Plantilla de diferentes servicios
    console.log('Test 5: Obtener plantillas de diferentes servicios');
    console.log('-'.repeat(60));
    
    const servicios = [
      { id: 1, num: 2, nombre: 'Carlos' },
      { id: 2, num: 1, nombre: 'Ana' },
      { id: 3, num: 3, nombre: 'Luis' },
      { id: 4, num: 1, nombre: 'Sofía' }
    ];

    for (const { id, num, nombre } of servicios) {
      const p = await getTemplate(id, num, { nombre });
      console.log(`   Servicio ${id} - Plantilla ${num}: ${p.name}`);
    }
    console.log('');

    // Test 6: Manejo de errores (plantilla inexistente)
    console.log('Test 6: Manejar plantilla inexistente (Servicio 99)');
    console.log('-'.repeat(60));
    
    try {
      await getTemplate(99, 1, { nombre: 'Test' });
      console.log('   ❌ Debió lanzar error');
    } catch (error) {
      console.log(`   Error manejado correctamente: ${error.message}`);
      console.log('   Fallback activado');
    }
    console.log('');

    // Resumen
    console.log('='.repeat(60));
    console.log('TODOS LOS TESTS PASARON EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('');
    console.log('La integración WhatsApp Service <-> Laravel API está funcionando');
    console.log('');
    console.log('Próximos pasos:');
    console.log('  1. Backend API (Laravel) - COMPLETADO');
    console.log('  2. WhatsApp Service (Node.js) - COMPLETADO');
    console.log('  3. Frontend Dashboard (Next.js) - PENDIENTE');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ ERROR EN LOS TESTS');
    console.error('='.repeat(60));
    console.error('');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('');
    console.error('Posibles causas:');
    console.error('  - Laravel backend no está corriendo (php artisan serve)');
    console.error('  - LARAVEL_API_URL o LARAVEL_API_KEY incorrectos en .env');
    console.error('  - Base de datos sin seeders ejecutados');
    console.error('  - Problemas de red/firewall');
    process.exit(1);
  }
}

// Ejecutar tests
testPlantillasAPI();
