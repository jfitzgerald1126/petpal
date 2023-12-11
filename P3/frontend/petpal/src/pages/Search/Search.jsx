
import { useEffect, useInsertionEffect, useMemo, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep';
import PetCard from '../../components/PetCard';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useUserContext } from '../../contexts/UserContext';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {

    const {shelters} = useUserContext();
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
    const [sortOption, setSortOption] = useState('listed')
    const [mobileFilterModalOpen, setMobileFilterModalOpen] = useState(false)
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        'shelter': [],
        'status': [],
        'gender': [],
        'size': [],
        'animal': [],
        'color': [],
    })

    // console.log(user)

    // DATA
    const [data, setData] = useState(null);
    const [resultsCount, setResultsCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sort_mapping_reverse = {
        'name': 'Name',
        '-name': 'Name descending',
        'size': 'Smallest',
        '-size': 'Largest',
        'listed': 'Newer',
        '-listed': 'Older',
    }

    useEffect(() => {
        fetchData()
    }, [searchParams])


    const fetchData = async () => {
        const url = 'http://127.0.0.1:8000/pets/pets/'
        try {
          const authToken = localStorage.getItem('access_token')
          const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              params: searchParams,
          });
          setData(response.data);
          setResultsCount(response.data.count)
        //   console.log(response.data)
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
    }



    const updateSearch = (search, sortOption, filters, page) => {
        const params = {}

        if (search != "") {
            params['search'] = search
        }

        params['ordering'] = sortOption


        Object.keys(filters).map((category)=>{
            if (filters[category].length > 0) {
                params[category] = filters[category].join(",")
            }
        })
        
        if (page) {
            setSearchParams({page:page, ...params})
        }
        else {
            setSearchParams(params)
        }
    }
    
    const debouncedFetchData = useMemo(() => debounce(updateSearch, 500), [])


    const all_filters = {
        'shelter': [],
        'status': ['available', 'withdrawn', 'adopted'],
        'gender': ['male', 'female', 'other'],
        'size': ['small', 'medium', 'large'],
        'animal': ['dog', 'cat', 'hamster', 'turtle', 'snake', 'rabbit'],
        'color': ['white', 'black', 'brown', 'green'],
    }

    const sort_mapping = {
        'Name': 'name',
        'Name descending': '-name',
        'Smallest': 'size',
        'Largest': '-size',
        'Newer': 'listed',
        'Older': '-listed',
    }

    const toggleFilter = (category, filter) => {
        const newFilters = cloneDeep(filters);
        if (newFilters[category].includes(filter)) {
            newFilters[category] = newFilters[category].filter(item => item !== filter);
        }
        else {
            newFilters[category].push(filter)
        }
        setFilters(newFilters)
    }

    useEffect(() => {
        setDropdownOpen(false)
        setMobileDropdownOpen(false)
    }, [sortOption])

    const previousPage = () => {
        if (data.previous && !loading) {
            updateSearch(search, sortOption, filters, page - 1)
        }
    }

    const nextPage = () => {
        if (data.next && !loading) {
            updateSearch(search, sortOption, filters, page + 1)
        }
    }

    useEffect(() => {
        if (!loading) {

        updateSearch(search, sortOption, filters);
        }
    }, [sortOption, filters])

    useEffect(() => {
        if (!loading) {
            debouncedFetchData(search, sortOption, filters)
        }
    }, [search])

    return (
    <div className="content-container">
      <div className="search-top-container d-flex flex-column w-100 px-5 pt-5">
        <h1 className="fs-3 fw-bold text-zinc-800">Browse Pets</h1>
        <div className="search-filtering-container d-flex flex-row w-100 pt-3 align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <input type="text" className="search-bar text-zinc-600" placeholder="🔍 search" value={search} onChange={(e)=>setSearch(e.target.value)}/>
            <span className="text-zinc-400 fs-8 ms-3 fw-medium">Viewing page {page} of {Math.ceil(resultsCount / 10)}</span>
          </div>

          <div className="d-flex flex-row align-items-center">
            <span className="text-zinc-400 fs-8 mx-3 fw-medium">{resultsCount} results found</span>
            <div className="dropdown" style={{position:'relative'}}>
              <button className="btn btn-secondary dropdown-toggle" type="button" onClick={()=>setDropdownOpen(!dropdownOpen)} id="dropdownMenuButton" data-expanded="false">
                Sort By: {sort_mapping_reverse[sortOption]}
              </button>
                {dropdownOpen && 
                    <div className="dropdown-menu dropdown-menu-right-screen-edge" id="dropdownMenu">
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Name'])}>Name</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Name descending'])}>Name descending</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Smallest'])}>Smallest</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Largest'])}>Largest</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Newer'])}>Newer</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Older'])}>Older</a>
                    </div>
                }
            </div>
          </div>
        </div>
        <div className="mobile-search-filtering-container d-flex flex-column w-100 mt-2">
          <input type="text" className="search-bar text-zinc-600 w-100" placeholder="🔍 search"/>
          <div className="d-flex flex-row align-items-center justify-content-between w-100 mt-3 px-2">
            <span className="text-zinc-400 fs-8 fw-medium">Viewing page {page} of {Math.ceil(resultsCount / 10)}</span>
            <span className="text-zinc-400 fs-8 fw-medium">{resultsCount} results found</span>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between w-100 mt-3 px-2">
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" onClick={()=>setMobileDropdownOpen(!mobileDropdownOpen)} id="dropdownMenuButtonMobile" data-expanded="false">
              Sort By: {sort_mapping_reverse[sortOption]}
              </button>
              {mobileDropdownOpen && 
                <div className="dropdown-menu" id="dropdownMenuMobile">
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Name'])}>Name</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Name descending'])}>Name descending</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Smallest'])}>Smallest</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Largest'])}>Largest</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Newer'])}>Newer</a>
                        <a className="dropdown-item" href="#" onClick={() => setSortOption(sort_mapping['Older'])}>Older</a>
                </div>
              }
            </div>
            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={()=>setMobileFilterModalOpen(true)} id="filterMenuButtonMobile">
              Filter By
            </button>
            {mobileFilterModalOpen && 
            <div id="mobileFilteringModal">
              <button className="modalCloseButton" onClick={()=>setMobileFilterModalOpen(false)}>×</button>
              <h3 className="font-weight-medium fs-5 text-zinc-700">Filtering</h3>
              {Object.keys(all_filters).map((category) => {
                if (category == "shelter") {
                    return (
                        <div className="filtering-category-container w-100">
                            <h6 className="font-weight-medium fs-6 text-zinc-500 text-capitalize">{category}</h6>
                            <div className="filtering-category-options w-100 ps-2 d-flex flex-column">
                                {Object.keys(shelters).map((shelter_id) => {
                                    return (
                                        <div className="filtering-option">
                                            <input type="checkbox" checked={filters[category].includes(shelter_id)} onChange={() => toggleFilter(category, shelter_id)}/><span>{shelters[shelter_id]['shelter_name']}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }
                return (
                    <div className="filtering-category-container w-100">
                        <h6 className="font-weight-medium fs-6 text-zinc-500 text-capitalize">{category}</h6>
                        <div className="filtering-category-options w-100 ps-2 d-flex flex-column">
                            {all_filters[category].map((filter) => {
                                return (
                                    <div className="filtering-option">
                                        <input type="checkbox" checked={filters[category].includes(filter)} onChange={() => toggleFilter(category, filter)}/><span>{filter}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
                }
                )}
            </div>
            }
          </div>
        </div>
      </div>

      {/* <!-- MAIN CONTENT --> */}
      <div className="search-results-container d-flex flex-row w-100 px-5 pt-5">
        {/* <!-- SIDEBAR --> */}
        <div className="filtering-sidebar d-flex flex-column me-5">
          <h3 className="font-weight-medium fs-5 text-zinc-700">Filtering</h3>
            {Object.keys(all_filters).map((category) => {
                if (category == "shelter") {
                    return (
                        <div className="filtering-category-container w-100">
                            <h6 className="font-weight-medium fs-6 text-zinc-500 text-capitalize">{category}</h6>
                            <div className="filtering-category-options w-100 ps-2 d-flex flex-column">
                                {Object.keys(shelters).map((shelter_id) => {
                                    return (
                                        <div className="filtering-option">
                                            <input type="checkbox" checked={filters[category].includes(shelter_id)} onChange={() => toggleFilter(category, shelter_id)}/><span>{shelters[shelter_id]['shelter_name']}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }
                return (
                    <div className="filtering-category-container w-100">
                        <h6 className="font-weight-medium fs-6 text-zinc-500 text-capitalize">{category}</h6>
                        <div className="filtering-category-options w-100 ps-2 d-flex flex-column">
                            {all_filters[category].map((filter) => {
                                return (
                                    <div className="filtering-option">
                                        <input type="checkbox" checked={filters[category].includes(filter)} onChange={() => toggleFilter(category, filter)}/><span>{filter}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>

        {/* <!-- PET CARDS --> */}
        <div className='listing-card-grid-container'>
            {!loading && error && "ERROR OCCURED"}
            {!loading && data && 
                <>
                <div className='pagination-button-container'>
                    <button onClick={previousPage} style={{visibility:data.previous ? 'visible':'hidden'}}>{'<'} Previous</button>
                    <button onClick={nextPage} style={{visibility:data.next ? 'visible':'hidden'}}>Next {'>'}</button>
                </div>
                <div className="listing-card-grid">
                    {data.results.length == 0 && 
                        <div>NO RESULTS FOUND</div>
                    }
                    {data.results?.map((pet) => {
                            return (
                                <PetCard 
                                    id={pet.id}
                                    image={pet.profile_image}
                                    status={pet.status}
                                    listed={pet.listed}
                                    name={pet.name}
                                    shelter={pet.shelter}
                                    animal={pet.animal}
                                    birthday={pet.birthday}
                                    description={pet.description}
                                />
                            )
                        })
                    }
                </div>
                <div className='pagination-button-container'>
                    <button onClick={previousPage} style={{visibility:data.previous ? 'visible':'hidden'}}>{'<'} Previous</button>
                    <button onClick={nextPage} style={{visibility:data.next ? 'visible':'hidden'}}>Next {'>'}</button>
                </div>
                </>
            }
        </div>
      </div>
    </div>
    )
}
export default SearchPage