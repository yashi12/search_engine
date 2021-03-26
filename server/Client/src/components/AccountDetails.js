const AccountDetails = () => {
    return (
        <div>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                    <form>
                        <br/><br/>
                        <div class="row">
                            <div class="col">
                                <label>Github</label>
                                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
                            </div>
                            <div class="col">
                                <label>Linked In</label>
                                <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                            </div>
                            
                            <div class="form-group">
                                <label>Twitter</label>
                                <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label >Bio</label>
                            <textarea class="form-control" id="" rows="5" maxLength="200"></textarea>
                        </div>
                        <div class="form-group">
                            <label >Skills</label>
                            <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label >Experience</label>
                            <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
                
            </div>
            
        </div>
        
    )
}

export default AccountDetails
