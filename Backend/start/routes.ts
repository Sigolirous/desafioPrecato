/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
/* Rota de teste */
Route.get('/', () => {return 'Servidor Rodando Liso'})
/* Rotas de credores */
Route.post('/credores/criar', 'CredoresController.criar')
Route.get('/credores/get/:id', 'CredoresController.get')
Route.patch('/credores/mudarNome/:id', 'CredoresController.patchNome')
Route.patch('/credores/aprovar/:idCredor', 'CredoresController.aprovar')
Route.delete('/credores/delete/:id', 'CredoresController.delete')

/* Rotas para entidades devedoras */
Route.post('/entidadesDevedoras/criar', 'EntidadesDevedorasController.criar')
Route.get('/entidadesDevedoras/get/:id', "EntidadesDevedorasController.get")
Route.delete('/entidadesDevedoras/delete/:id', "EntidadesDevedorasController.delete")
Route.patch('/entidadesDevedoras/mudarNome/:id', "EntidadesDevedorasController.patchNome")

/* Rotas para criar Solicitações de Pagamento */
Route.post('/pagamentos/criar', 'PagamentosController.criar')
Route.get('/pagamentos/get/:id', 'PagamentosController.get')
Route.patch('/pagamentos/mudar/:id/:field', 'PagamentosController.patch')
Route.delete('/pagamentos/delete/:id', 'PagamentosController.delete')
