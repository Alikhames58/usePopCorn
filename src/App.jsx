import axios from "axios";
import { useEffect, useState, useRef } from "react"
import StarRating from './StarRating';
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const keyApi = '7c2c07e3'
export default function App() {
    const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const detailsRef = useRef(null); 
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(()=>{
    const storedWatcheed = localStorage.getItem('watched')
    return JSON.parse(storedWatcheed) || []
  });


  function onSelectMovie(id){
    setSelectedId( (selectedId)=> selectedId === id ? null : id)
  }
  function HandleAddWatched(movie){
    setWatched((watched)=>[...watched , movie])
  }
  function onCloseDetails(){
    setSelectedId(null)}
  function onHandleRemoveWatchedMovie(id){
    setWatched((watched)=> watched.filter((movie)=> movie.imdbId !== id))
  }

  

  useEffect(function() {
    
    if (selectedId && window.innerWidth <= 768) {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedId]);

  useEffect(()=>{
    localStorage.setItem('watched', JSON.stringify(watched))
  },[watched])
  useEffect(()=>{
    const controller = new AbortController()
    setSelectedId(null)
    async function fetchMovies(){
      try {
        setLoader(true)
        setError('')
        const res = await axios.get( `https://www.omdbapi.com/?s=${query}&apikey=${keyApi}`,controller.signal)
        const data = res.data.Search
        console.log(data);
        
        if(!data){
          throw new Error('No movies found')
        }
 
        setMovies(data);
      } catch (error) {
        setError(error.message);
        
      }finally{
        setLoader(false)
      }
    }
    if(query.length < 3){
      setMovies([])
      setError('')
      return  
    }
    fetchMovies()
    return () => {
      controller.abort()
    }
  },[query])


  return (
    <>
      <Navbar>
        <InputSearch query = {query} setQuery = {setQuery} />
        <NumResult movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {query.length < 3 && <EmptyMessage/> }
          {loader && <Loader />}
          {!loader && !error && <MovieList movies={movies} onSelectMovie = {onSelectMovie}  />}
          {error && <ErrorMessage message={[error]}/>}
        </Box>
       <div ref={detailsRef}> 
          <Box>
            {selectedId ? <MovieDetails watched={watched} onHandleAddWatched={HandleAddWatched} onCloseDetails={onCloseDetails} selectedId={selectedId} /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList onHandleRemoveWatchedMovie={onHandleRemoveWatchedMovie} watched={watched} onSelectMovie = {onSelectMovie} />
              </>}
          </Box>
        </div>
      </Main>
    </>
  );
}
function EmptyMessage() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <h3 className="empty-state__title">Find Your Next Favorite Movie</h3>
      <p className="empty-state__text">
        Start by typing a movie title in the search bar above.
        <br />
        Let's discover something great to watch!
      </p>
    </div>
  );
}
function ErrorMessage({ message }) {
  return (
    <>
      <p className="error"> {message}❌</p>
    </>
  );
}

function Loader(){
  return (
    <>
      <p className="loader">Loading...</p>
    </>
  );
}
function Navbar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}
function Logo() {
  return (
    <>
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
    </>
  );
}
function InputSearch({query , setQuery , onHandleRemoveQuery}) {
    const inputRef = useRef(null)


    useEffect(() => {
     inputRef.current.focus()

  }, [])
  

  return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputRef}
      />
     
  );
}
function NumResult({ movies }) {
  return (
    <>
      <p className="num-results">
        Found <strong> {movies.length} </strong> results
      </p>
    </>
  );
}
function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "–" : "+"}
        </button>
        {isOpen && children}
      </div>
    </>
  );
}
function WatchedMoviesList({ watched , onHandleRemoveWatchedMovie , onSelectMovie }) {
  return (
    <>
      <ul className="list list-watched">
        {watched.map((movie) => (
          
          <WatchedMovie movie={movie} key={movie.imdbId } onHandleRemoveWatchedMovie = {onHandleRemoveWatchedMovie}  onSelectMovie = {onSelectMovie}/>
        ))}
      </ul>
    </>
  );
}
function WatchedMovie({ movie , onHandleRemoveWatchedMovie , onSelectMovie}) {
  return (
    <>
      <li key={movie.imdbID} onClick={()=> onSelectMovie(movie.imdbId)}>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
            <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onHandleRemoveWatchedMovie(movie.imdbId); }}>❌</button>

        </div>

      </li>
    </>
  );
}
function MovieDetails({selectedId , onCloseDetails , onHandleAddWatched , watched}){
  const [isLoading, setIsLoading] = useState(false)
  const [movie, setMovie] = useState({})
  const {Title : title , Year : year , Poster : poster , Runtime : runtime  , imdbRating , Plot : plot , Released : released , Actors : actors , Director : director , Genre : genre} = movie
  const [userRating, setUserRating] = useState('')
  const isWatched =  watched.map((movie)=> movie.imdbId ).includes(selectedId)
  const watchedUserRating = watched.find((movie)=> movie.imdbId === selectedId)?.userRating

  function handleAdd(){
    const newWatchedMovie = {
      imdbId : selectedId,
      title,
      poster,
 imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating
    }
    onHandleAddWatched(newWatchedMovie)
    onCloseDetails()
    
  }
  useEffect(()=>{
    document.addEventListener('keydown',(e)=>{
      if(e.code==='Escape')
        {
          onCloseDetails()
          console.log(e.code);
        }
    })
    
  },[])
  useEffect(()=>{

  async function getMovieDetails(){
    setIsLoading(true)
      const res = await axios.get( `https://www.omdbapi.com/?apikey=${keyApi}&i=${selectedId}`)
      const data = res.data
      setMovie(data) 
      setIsLoading(false)
    }
    getMovieDetails()
  },[selectedId ])
  useEffect(()=>{
    if(!title)return
    document.title = title
    return()=>{
      document.title = 'usePopCorn'
    }
  },[title])
  return <div className="details">
    {isLoading ? <Loader/> : 
   <>
    <header>
    <button className="btn-back" onClick={onCloseDetails}>
      &larr;
    </button>
    <img src={poster} alt={`Poster Of Movie Is ${title }`} />
    <div className="details-overview">
      <h2>{title}</h2>
      <p> {released} &bull; {runtime} </p>
      <p> {genre} </p>
      <p> <span>⭐</span>{imdbRating} IMDB Rating </p>
    </div>
    </header>
    <section>
      <div className="rating">
    { !isWatched ? <>
      <StarRating maxRating={10} size={24} handleRating = {setUserRating}/>
      {userRating > 0 &&<button className="btn-add" onClick={handleAdd}>Add To List</button>}
     </> : <p>You Rated This Movie Before With {watchedUserRating}⭐</p>}
      </div>
      <p>
        <em> {plot} </em>
      </p>
      <p>Starring {actors}</p>
      <p>Directed By {director}</p>
    </section>
   </>
    }
  </div>
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(1)
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(1)
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(1)
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  );
}
function MovieList({ movies , onSelectMovie }) {
  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <Movie movie={movie} key={movie.Title}  onSelectMovie = {onSelectMovie}/>
        ))}
      </ul>
    </>
  );
}
function Movie({ movie , onSelectMovie }) {
  return (
    <>
      <li key={movie.imdbID} onClick={()=>onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    </>
  );
}
