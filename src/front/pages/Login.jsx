export const Login = () => {
    return (
        <div>
            <form className="container border border-info p-2 " style={{ width: "500px" }}>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1"></input>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
            
        </div>
    )
}