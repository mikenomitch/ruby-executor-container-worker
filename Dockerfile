FROM ruby:3.2-slim

# Install dependencies
RUN apt-get update && \
	apt-get install -y --no-install-recommends \
	build-essential \
	curl \
	&& rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY ./executor/Gemfile /app/Gemfile

# Install dependencies
RUN bundle install

# Copy the application file
COPY ./executor/app.rb /app/app.rb

# Expose port
EXPOSE 4567

# Command to run the application
CMD ["bundle", "exec", "ruby", "app.rb", "-o", "0.0.0.0"]
