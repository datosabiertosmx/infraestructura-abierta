////////////////////////////////////////////////////////////////////////////////
//
// ⭐ STORE DE RESULTADOS DE BÚSQUEDA
//
////////////////////////////////////////////////////////////////////////////////

/*
 * 👾 S T A T E
 * ----------------------------------------------------------------------
 */
const state = {};

/*
 * 👾 G E T T E R S
 * ----------------------------------------------------------------------
 */
const getters = {
    SearchResultsList(state, getters/*, rootState*/){
      if(!getters.ProjectsList.length) return [];
      return [];
    }
};

/*
 * 👾 A C T I O N S
 * ----------------------------------------------------------------------
 */
const actions = {};

/*
 * 👾 M U T A T I O N S
 * ----------------------------------------------------------------------
 */
const mutations = {};


/*
 * ♥️ E X P O R T
 * ----------------------------------------------------------------------
 */
export default {
  //namespaced: true,
  state,
  getters,
  actions,
  mutations
}