require "sinatra"
require "sinatra/json"
require "json"
require "stringio"


# Enable CORS
before do
  headers \
    "Access-Control-Allow-Origin" => "*",
    "Access-Control-Allow-Methods" => "POST, OPTIONS",
    "Access-Control-Allow-Headers" => "Content-Type"
end

options "*" do
  200
end

# Create a binding that will persist between requests
$BINDING = binding

# Execute the code and return the result
post "/code" do
  begin
    content_type :json

    request_body = JSON.parse(request.body.read)
    code = request_body["code"]

    # Capture stdout
    old_stdout = $stdout
    captured_output = StringIO.new
    $stdout = captured_output

    # Execute the code in the persistent binding
    result = $BINDING.eval(code)

    # Restore stdout
    $stdout = old_stdout

    # Convert result to string for JSON response
    json({
      status: "success",
      result: result.inspect,
      output: captured_output.string
    })
  rescue => e
    # Ensure stdout is restored even if there's an error
    $stdout = old_stdout if defined?(old_stdout)

    status 400
    json({
      status: "error",
      error: e.message,
      backtrace: e.backtrace
    })
  end
end

# Health check endpoint
get "/health" do
  "OK"
end
