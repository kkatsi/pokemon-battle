const useGetSelectedPokemons = () => {
  const query = new URLSearchParams(location.search);
  const you = query.get("you");
  const enemy = query.get("enemy");

  return { you, enemy };
};

export default useGetSelectedPokemons;
