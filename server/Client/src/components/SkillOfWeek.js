const SkillOfWeek = () => {
    return (
        <section className="container-fluid" id="skillOfWeek">
            <h1>Skill Of the Week</h1> <br/>
            <div className="row">
                <div className="col">
                    <div className="card" style="width: 18rem;">
                        <img src="{{skill.skill_image}}" className="card-img-top" alt="..."></img>
                        <div className="card-body">
                            <h4 className="card-title"></h4> 
                            <h5 className="card-text">Searches: </h5>
                        </div>
                        <div className="card-body">
                            <button onclick="searchGivenSkill('{{ skill.skill_name }}')" className="btn btn-outline-info">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SkillOfWeek
