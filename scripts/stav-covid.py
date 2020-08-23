import requests
from bs4 import BeautifulSoup
import datetime
import re

# Fetch the output to a string, `output`.
url = "https://wp.stolaf.edu/reslife/dining-hours/"
output = requests.get(url).text

# Now, parse it.
output = BeautifulSoup(output)

# NOTE(rye): There is no filtering to prevent loading tables that aren't valid,
# so please double-check the output of this script.
tables = output.find_all("table")

# A regex to match strings like "Sunday, August 23"
date_re = re.compile('\w+, \w+ \d{1,2}')

# If the given tag only has one set of contents, just grab the contents.
def meal_name_from(th):
	if len(th.contents) == 1:
		return th.get_text()
	else:
		return None

# Start with an empty schedule set
schedules = {}

# For each of the HTML tables we found,
for table in tables:
	print("Processing a table...")

	# Find the prior sibling, which is an h3 containing the day in some format.
	# Each table should have an h3 before it that has date information in it.
	header = table.find_previous_sibling("h3").get_text().strip()
	print('Found a header sibling with text "{}"'.format(header))

	# Search the text for just the date
	matching_text = date_re.match(header).group(0)

	# NOTE(rye): Parses text like "Sunday, August 23"
	date = datetime.datetime.strptime(matching_text, "%A, %B %d")

	# Move the date to the current year
	date = datetime.datetime(date.today().year, date.month, date.day)

	# If the computed date is more than six months before today, assume it actually belongs in the next year.
	if date < date.today() + datetime.timedelta(days=-180):
		date = datetime.datetime(date.year + 1, date.month, date.day)

	# We only know the date, so let's back out to that.
	date = date.date()

	print("Inferred date of {}; processing table now.".format(date))

	body = table.find("tbody")

	# NOTE(rye): Should only have one thead
	meals = [meal_name_from(th) for th in table.find("thead").find("tr").find_all("th")]
