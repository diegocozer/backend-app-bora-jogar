// Usando import para carregar o axios
import axios from 'axios';

class ApiMapsController {

  
  async searchLocal({ request, response, params }) {
    try {
      const {latitude, longitude, name } = params;
      if (!name) {
        return response.status(400).json({ error: 'Nome do campo é obrigatório.' });
      }
  
      if (!latitude || !longitude) {
        return response.status(400).json({ error: 'Latitude e longitude são obrigatórias.' });
      }
  
      const apiKey = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyBiTvYTl78Xs04C0ILLASe-4niwunt_5Lk';
  
      const url  = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=campo%20${name}&location=${latitude},${longitude}&key=${apiKey}`;
  
      const apiResponse = await axios.get(url);
      const places = apiResponse.data.results;

      
      const resultsPromises = places.map(async (place) => {
        // const directionsUrl = ` https://maps.googleapis.com/maps/api/directions/json?destination=${place.formatted_address}&origin=${latitude},${longitude}&key=AIzaSyAsVi8UJcYpTNs8isWIYk5Ycw6Njny2MzQ`;
  
        // // Chamar a Directions API
        // const directionsResponse = await axios.get(directionsUrl);
        // const route = directionsResponse.data.routes[0];
        //   // Se houver rota disponível
        // if (route) {
        //   const leg = route.legs[0];
  
          
        // } else {
          return {
            local_jogo: place.name,
            endereco_jogo: place.formatted_address,
            distancia_jogo: 'Distância não disponível',
            duracao_jogo: 'Duração não disponível',
            urlmaps_jogo: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`,
          };
        // }
      });
          // Aguardar a resolução de todas as promessas antes de enviar a resposta
    const results = await Promise.all(resultsPromises);
      return response.status(200).json(results);
    } catch (error) {
      console.error('Erro ao buscar locais esportivos:', error);
      return response.status(500).json({ error: 'Erro ao buscar locais esportivos' });
    }
  }
  

  async getLocalJogo({ params, request, response }) {
    try {
      const { latitude, longitude, type } = params;
      const { radius = 1000000, limit = 1000 } = request.qs();
      const apiKey = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyBiTvYTl78Xs04C0ILLASe-4niwunt_5Lk';
  
      let allPlaces:any = [];
      let nextPageToken = null;
  
      // 1. Montar a URL inicial para buscar locais próximos
      let baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${type}&key=${apiKey}`;
  
      // 2. Repetir até que não haja mais `next_page_token`
      do {
        if (nextPageToken) {
          baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextPageToken}&key=${apiKey}`;
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Aguardar 2 segundos para evitar limitações de taxa de consulta
        }
  
        const apiResponse = await axios.get(baseUrl);
        const places = apiResponse.data.results;
        allPlaces = [...allPlaces, ...places];
        nextPageToken = apiResponse.data.next_page_token || null;
  
      } while (nextPageToken);
  
      // 3. Aplicar o limite, caso necessário
      const limitedResults = allPlaces.slice(0, limit);
  
      // 4. Adicionar as informações de distância para cada local
      const resultsPromises = limitedResults.map(async (place) => {
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?destination=${place.vicinity}&origin=${latitude},${longitude}&key=${apiKey}`;
  
        // Chamar a Directions API
        const directionsResponse = await axios.get(directionsUrl);
        const route = directionsResponse.data.routes[0];
  
        if (route) {
          const leg = route.legs[0];
  
          return {
            local_jogo: place.name,
            endereco_jogo: place.vicinity,
            distancia_jogo: leg.distance.text, 
            duracao_jogo: leg.duration.text,  
            urlmaps_jogo: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`,
          };
        } else {
          return {
            local_jogo: place.name,
            endereco_jogo: place.vicinity,
            distancia_jogo: 'Distância não disponível',
            duracao_jogo: 'Duração não disponível',
            urlmaps_jogo: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`,
          };
        }
      });
  
      const results = await Promise.all(resultsPromises);
  
      return response.status(200).json({
        results,
        totalResults: allPlaces.length,
      });
    } catch (error) {
      console.error('Erro ao buscar locais esportivos:', error);
      return response.status(500).json({ error: 'Erro ao buscar locais esportivos' });
    }
  }
  
}

export default ApiMapsController;
