export default class UrlReader {
  static read() {
    if(window === undefined || window.location === undefined) {
      console.warn("WARNING: UrlReader can't detect the URL on your browser.")
    }
    const qString = window.location.href.split('?').pop();
    const queries = qString.split('&').map(pair => pair.split('='))
    const queryMap = {}
    queries.forEach(query => {
      queryMap[query[0]] = query[1]
    })
    return queryMap
  }
}
