import styles from "../styles/dashboard.module.css";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.cuadroBusqueda}
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <span className={`material-symbols-outlined ${styles.searchIcon}`}>
        search
      </span>
    </div>
  );
};

export default SearchBar;