const AddSkills = () => {
    return (
        <div>
            <div className="row">
                <div className="col-3"/>
                <div className="col-6">
                    <form>
                        <div className="form-group">
                            <br/><br/>
                            <label>Enter Skills</label>
                            <small className="form-text text-muted">Max 5.</small>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 1"/>
                            <br/>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 2"/>
                            <br/>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 3"/>
                            <br/>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 4"/>
                            <br/>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 5"/>
                            <br/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
                
            </div>
            
        </div>
        
    )
}

export default AddSkills
