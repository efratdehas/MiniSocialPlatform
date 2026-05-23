import React from 'react';
import { PiSwap } from "react-icons/pi";
import './FilterBar.css';

function FilterBar({ criteria = [], search, setSearch, sortBy, setSortBy }) {
    return (
        <div className="Filter-bar-container">
            {/* תיבת בחירה לסוג המיון (למשל לפי כותרת או מזהה) */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {criteria.map((crit, index) => (
                    <option key={index} value={crit}>{crit}</option>
                ))}
            </select>

            {/* שדה הזנת טקסט לחיפוש */}
            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder={`Search by ${search.field}...`}
                    value={search.query}
                    onChange={(e) => setSearch(prev => ({ ...prev, query: e.target.value }))}
                />
                {search.query && (
                    <button
                        className="clear-btn"
                        onClick={() => setSearch(prev => ({ ...prev, query: '' }))}
                    >
                        X
                    </button>
                )}
            </div>

            {/* כפתור להחלפת שדה החיפוש המבוקש */}
            <button className="switch-btn" onClick={() => search.changeFiled()}>
                <PiSwap />
            </button>
        </div>
    );
}

export default FilterBar;