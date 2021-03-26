const AddPost = () => {
    return (
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <br/><br/>
                <div class="card">
                    <div class="card-body">
                        <form>
                            <div class="form-group">
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Add Image</label>
                                    <input class="form-control" type="file" id="formFile"></input>
                                </div>
                                <div class="mb-3">
                                    <label>Add Caption</label>
                                    <small>(Max 200 words)</small>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                <label>Add Tags</label>
                                <small>(Please don't add more than 30 tags)</small>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default AddPost
