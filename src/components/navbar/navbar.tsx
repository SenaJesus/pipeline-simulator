const NavBar = () => {
    return (
        <nav
            style={{
                backgroundColor: '#330708',
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                userSelect: 'none'
            }}
        >
            <h1
                style={{ color: '#e84624', fontWeight: '700' }}
            >
                Pipeline Simulator
            </h1>
            <div style={{ display: 'flex', alignItems: 'end' }} >
                <h3 style={{ color: '#e87624' }} >
                    ICMC-Usp
                </h3>
            </div>
        </nav>
    );
};

export default NavBar;