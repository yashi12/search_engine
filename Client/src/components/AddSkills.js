const AddSkills = () => {
    return (
        <div>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                    <form>
                        <div class="form-group">
                            <br/><br/>
                            <label>Enter Skills</label>
                            <small class="form-text text-muted">Max 5.</small>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 1"></input>
                            <br/>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 2"></input>
                            <br/>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 3"></input>
                            <br/>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 4"></input>
                            <br/>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skill 5"></input>
                            <br/>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
                
            </div>
            
        </div>
        
    )
}

export default AddSkills
