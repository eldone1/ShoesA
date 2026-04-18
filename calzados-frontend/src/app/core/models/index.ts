// src/app/core/models/marca.model.ts
export interface Marca {
  id: number;
  nombre: string;
  activo: boolean;
}
export interface MarcaRequest {
  nombre: string;
}

// src/app/core/models/variante.model.ts — included here for simplicity
export interface Variante {
  id: number;
  productoNombre?: string;
  color: string;
  talla: string;
  sku: string;
  codigoBarras: string;
  precioCompra: number;
  porcentajeGanancia: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  stockBajo: boolean;
}
export interface VarianteRequest {
  color: string;
  talla: string;
  sku: string;
  codigoBarras: string;
  precioCompra: number;
  porcentajeGanancia: number;
  stock: number;
  stockMinimo: number;
}

// src/app/core/models/producto.model.ts
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  marca: Marca;
  variantes: Variante[];
}
export interface ProductoRequest {
  marcaId: number | null;
  nombre: string;
  descripcion: string;
  variantes: VarianteRequest[];
}

// src/app/core/models/user.model.ts
export type Rol = 'ADMIN' | 'CAJERO';
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  createdAt: string;
}
export interface UserRequest {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

// src/app/core/models/caja.model.ts
export type EstadoCaja = 'ABIERTA' | 'CERRADA';
export interface Caja {
  id: number;
  cajero: User;
  apertura: string;
  cierre: string | null;
  montoInicial: number;
  totalEfectivo: number;
  totalYape: number;
  totalTarjeta: number;
  montoFinalEsperado: number;
  montoFinalReal: number;
  diferencia: number;
  estado: EstadoCaja;
  totalVentas: number;
}
export interface AperturaCajaRequest {
  montoInicial: number;
}
export interface CierreCajaRequest {
  montoFinalReal: number;
}

// src/app/core/models/venta.model.ts
export type MetodoPago = 'EFECTIVO' | 'YAPE' | 'TARJETA';
export interface DetalleVenta {
  id: number;
  varianteId: number;
  productoNombre: string;
  marcaNombre: string;
  talla: string;
  color: string;
  sku: string;
  codigoBarras: string;
  cantidad: number;
  precioUnitario: number;
  descuentoItem: number;
  subtotal: number;
}
export interface Venta {
  id: number;
  cajaId: number;
  cajero: User;
  fecha: string;
  subtotal: number;
  descuento: number;
  total: number;
  metodoPago: MetodoPago;
  montoRecibido: number | null;
  vuelto: number;
  notas: string;
  detalles: DetalleVenta[];
}
export interface DetalleVentaRequest {
  varianteId: number;
  cantidad: number;
  descuentoItem: number;
}
export interface VentaRequest {
  metodoPago: MetodoPago;
  montoRecibido: number | null;
  descuento: number;
  notas: string;
  detalles: DetalleVentaRequest[];
}

// src/app/core/models/reporte.model.ts
export interface ReporteVentaProducto {
  varianteId: number;
  productoNombre: string;
  talla: string;
  color: string;
  cantidadVendida: number;
  totalVendido: number;
}
export interface ResumenDiario {
  fecha: string;
  cantidadVentas: number;
  totalEfectivo: number;
  totalYape: number;
  totalTarjeta: number;
  totalGeneral: number;
}
export interface StockBajo {
  varianteId: number;
  productoNombre: string;
  marcaNombre: string;
  talla: string;
  color: string;
  sku: string;
  codigoBarras: string;
  stockActual: number;
  stockMinimo: number;
}

// ── Cliente ───────────────────────────────────────────────────────────────────
export interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  ruc: string;
  razonSocial: string;
  numeroTelefono: string;
  email: string;
  direccion: string;
  activo: boolean;
  createdAt: string;
}
export interface ClienteRequest {
  nombre: string;
  dni?: string;
  ruc?: string;
  razonSocial?: string;
  numeroTelefono?: string;
  email?: string;
  direccion?: string;
}

// ── Comprobante ───────────────────────────────────────────────────────────────
export type TipoComprobante = 'BOLETA' | 'FACTURA';

export interface ComprobanteRequest {
  ventaId: number;
  tipo: TipoComprobante;
  clienteId?: number | null;
  clienteNombre?: string;
  clienteDni?: string;
  clienteRuc?: string;
  clienteRazonSocial?: string;
  clienteDireccion?: string;
  clienteEmail?: string;
}

export interface ComprobanteResponse {
  id: number;
  serie: string;
  tipo: TipoComprobante;
  numero: number;
  fechaEmision: string;
  clienteId: number | null;
  clienteNombre: string;
  clienteDni: string;
  clienteRuc: string;
  clienteRazonSocial: string;
  clienteDireccion: string;
  clienteEmail: string;
  ventaId: number;
  cajeroNombre: string;
  subtotal: number;
  descuento: number;
  total: number;
  igv: number;
  baseImponible: number;
  metodoPago: string;
  detalles: any[];
}
