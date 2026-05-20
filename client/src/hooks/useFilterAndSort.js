import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const useFilterAndSort = (type = ['title', 'id']) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'id');
    const [search, setSearch] = useState({
        query: searchParams.get('q') || '',
        fieldNumber: type.indexOf(searchParams.get('field')) !== -1 ? type.indexOf(searchParams.get('field')) : 0,
    });

    const currentField = type[search.fieldNumber];

    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            
            if (search.query) {
                params.set('q', search.query);
                params.set('field', currentField);
            } else {
                params.delete('q');
                params.delete('field');
            }
            
            if (sortBy !== 'id') {
                params.set('sort', sortBy);
            } else {
                params.delete('sort');
            }
            
            setSearchParams(params, { replace: true });
        }, 500);

        return () => clearTimeout(handler);
    }, [search.query, currentField, sortBy, searchParams, setSearchParams]);

    const changeFiled = () => {
        setSearch(prev => ({ ...prev, fieldNumber: (prev.fieldNumber + 1) % type.length }));
    };

    return {
        search: { query: search.query, field: currentField, changeFiled },
        setSearch,
        sortBy, 
        setSortBy
    };
};

export default useFilterAndSort;