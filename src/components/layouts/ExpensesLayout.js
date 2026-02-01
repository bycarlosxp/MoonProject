import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'

export const ExpensesLayout = async () => {
    const desktopSidebar = Sidebar('expenses')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // Cargar gastos
    let expenses = [];
    try {
        const res = await fetch('http://localhost:3000/api/operational-expenses');
        if (res.ok) {
            expenses = await res.json();
        }
    } catch (error) {
        console.error('Error cargando gastos:', error);
    }

    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50 animate-fade-in">
        ${desktopSidebar}
        
        <main class="main-content flex-1 p-4 md:p-8 md:ml-64 transition-all mb-16 md:mb-0">
            <div class="w-full max-w-4xl mx-auto">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-800">Gastos Operativos</h1>
                    <p class="text-gray-500 text-sm mt-1">Gestión y registro de gastos</p>
                </div>

                <!-- Card Agregar Gasto -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="font-bold text-gray-700 flex items-center gap-2">
                            <i class="ri-add-circle-line text-green-500"></i> Nuevo Gasto
                        </h2>
                    </div>
                    
                    <div class="p-6">
                        <form id="expense-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="text" name="expense_description" placeholder="Descripción del gasto" 
                                class="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                            <input type="number" step="0.01" name="expense_amount" placeholder="Monto" 
                                class="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                            <input type="date" name="expense_date" 
                                class="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                            <button type="submit" class="bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                                <i class="ri-add-line"></i> Agregar
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Card Lista de Gastos -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="font-bold text-gray-700 flex items-center gap-2">
                            <i class="ri-list-check text-blue-500"></i> Registro de Gastos
                        </h2>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b">
                                <tr class="text-xs text-gray-600 uppercase tracking-wider">
                                    <th class="px-6 py-4 text-left font-bold">Descripción</th>
                                    <th class="px-6 py-4 text-right font-bold">Monto</th>
                                    <th class="px-6 py-4 text-center font-bold">Fecha</th>
                                    <th class="px-6 py-4 text-center font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="expenses-table-body" class="divide-y divide-gray-100 text-sm">
                                ${expenses.length === 0 ?
            '<tr><td colspan="4" class="text-center py-12 text-gray-400">No hay gastos registrados</td></tr>' :
            expenses.map(expense => {
                const amount = parseFloat(expense.expense_amount);
                const date = new Date(expense.expense_date).toLocaleDateString('es-ES');
                return `
                                            <tr class="hover:bg-gray-50 transition-colors">
                                                <td class="px-6 py-4">${expense.expense_description}</td>
                                                <td class="px-6 py-4 text-right font-semibold text-green-600">$${amount.toFixed(2)}</td>
                                                <td class="px-6 py-4 text-center text-gray-600">${date}</td>
                                                <td class="px-6 py-4 text-center">
                                                    <button class="btn-delete-expense text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors" data-id="${expense.expense_id}">
                                                        <i class="ri-delete-bin-line text-lg"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
            }).join('')
        }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    `
}
