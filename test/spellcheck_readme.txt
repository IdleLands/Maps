# to check spellings, please git clone both IdleLands Maps & Custom-Assets
#   if you've cloned IdleLands/IdleLands, and run npm install in the root, it will auto load both these repos
#   into an assets subdir, under the IdleLands root
#
# before you start, put ok_words & ok_fragments into the assets dir (they're in /Maps/test/)
#
# CHECKING THE SPELLING OF MAPS
#
# 1. ok_fragments and ok_words must be in the assets dir (or at least, the dir above Maps or 
#	Custom-Assets repo root). If you move them elsewhere, it's up to you to adjust the path in 
#	the commands below.
# 2. These commands should be run on Linux ONLY (sorry, spell won't work on mac. dunno about win)
# 3. You must have the 'spell' app installed (apt-get install spell, on debian)
# 4. Run these from the repo root (ie assets/maps and assets/content)
# 5. These commands will only work for maps (which are json). there is a separate set of commands
#	for Custom-Assets (content, which are .txt files)

# 1. to find mis-spellings
find . -type f \( -name '*.json' ! -name 'package.json' \) -exec grep -v '"data":' {} \; | tr ",.{}:\"[]$%=" " " | tr " \t" "\n" | grep -v -e "^$" | grep -vEf ../ok_fragments | grep -viwf ../ok_words | spell | sort | uniq -ic | sort -n


# 2. to dump them all out
find . -type f \( -name '*.json' ! -name 'package.json' \) -exec grep -v '"data":' {} \; | tr ",.{}:\"[]$%=" " " | tr " \t" "\n" | grep -v -e "^$" | grep -vEf ../ok_fragments | grep -viwf ../ok_words | spell | sort | uniq -i > check_words


# 3. to display specifics
xargs -a check_words -d "\n" -I{} grep --color=always -irwn {} * | grep -v check_words | grep '.json'


# EXPLANATIONS (Long. If you know Linux CLI, you can ignore the below)
#
#==========================================================
# 1. DISPLAY ALL MIS-SPELLINGS
#
#
# find . -type f \( -name '*.json' ! -name 'package.json' \) -exec grep -v '"data":' {} \; | 
# tr ",.{}:\"[]$%=" " " | tr " \t" "\n" | grep -v -e "^$" | grep -vEf ../ok_fragments | grep -viwf ../ok_words | 
# spell | sort | uniq -ic | sort -n
#
# 
# a) find . -type f \( -name '*.json' ! -name 'package.json' \) -exec grep -v '"data":' {} \;
#
# find	
#		finds all files in the tree
# .	
#		starting in the current dir
# -type f	
#		files only (not directories)
# \( -name '*.json' ! -name 'package.json' \)	
#		named *.json, but ignore package.json (not a map)
# -exec 
#		for each file, execute the following command
# grep -v '"data":' {} \;
#		grep (look for)
#		-v == exclude
#		any lines including "data:"
#		{} is replaced with each file path
#		\; just means end of the find command
#
#
# b) tr ",.{}:\"[]$%=" " "
#
# tr
#		translates the the first string into the second (basically, search and replace)
# ",.{}:\"[]$%="
#		replace those chars (note the escaped " char)...
# " "
#		... with a space
#
# NOTES: this works on everything passed through from the previous command. ie the contents of all
# the non package.json files under the current dir, excluding the data: lines. Thus, it strips out all 
# those punctuation marks and replaces them with spaces. In short: this is what breaks up words for
# us, so we can spell check them
#
#
# c) tr " \t" "\n"
# 
#		translates all the tabs & spaces into newlines. So now we have one word on each line
#
#
# d) grep -v -e "^$"
#
# grep -v
#		pass through everything that -doesn't- match this
#
# -e
#		use regex (rather than a regular string)
#
# "^$"
#		^ means start of string. $ means end of string. ie, all empty lines
#
# NOTES: this grep just strips out any blank lines (no point in spell checking them, right?)
#
#
# d) grep -vEf ../ok_fragments
#
# grep -v
#		pass through everything that -doesn't- match this
#
# -E
#		use extended regex (frankly, I suspect we could just use -e here. The diff is minor)
# -f
#		do the grep based on the contents of the file passed in (ok_fragments)
#
# ok_fragments
#		this includes regex matches that we don't need to spellcheck
#
# NOTES: because we're using regex matches, we can do things like ^gid - which means any word
# starting with gid we'll ignore. Thus gid1, gid2, gid3 etc. We can also do things like Percent$, which 
# means we'll ignore dexPercent, agiPercent etc. You get the idea
#
#
# e) grep -viwf ../ok_words
#
# grep -v
#		pass through everything that -doesn't- match this
# -i
#		case insensitive match
# 
# -w
#		match whole words only. So Frank, but not the incorrect Frankenstien
#
# -f
#		do the grep based on the contents of the file passed in (ok_words)
#
# ok_words
#		the list of all the checked & acceptable non-English-but-ok-in-idle-lands words. eg yarrr
#
#
# f) spell
#
# NOTES: spell checks each line (one word per line). This app only outputs mis-spellings
#
# g) sort
#
# NOTES: sorts the output alphabetically. We do this so we can get only unique instances (using uniq), which doesn't work unless they're ordered
#
# h) uniq -ic
#
# -i
#		case insensitive
# -c
#		output a count (this will be first on the line. eg 27	hellp)
#
# i) sort -n
#
# NOTES: sorts the output numerically. Since the first thing on the line is the count, this means we 
# will output the mis-spellings from least to most commonly occurring (ending with the most common)
#
#
#==========================================================
# 2. DUMP OUT MIS-SPELLINGS TO FILE check_words
#
#
# find . -type f \( -name '*.json' ! -name 'package.json' \) -exec grep -v '"data":' {} \; | 
# tr ",.{}:\"[]$%=" " " | tr " \t" "\n" | grep -v -e "^$" | grep -vEf ../ok_fragments | grep -viwf ../ok_words | 
# spell | sort | uniq -i > check_words
#
#
# same as before, up to g)
# h) uniq -i
#
# -i
#		case insensitive
#
# i) > check_words
#		redirects all the previous output (ie, all mis-spelled words) into a file called check_words
#		creates the file if it doesn't exist. Overwrites it if it does
#
#
#==========================================================
# 3. DISPLAY SPECIFIC INSTANCES OF MIS-SPELLED WORDS
#
#
# xargs -a check_words -d "\n" -I{} grep --color=always -irwn {} * | grep -v check_words | grep '.json'
#
#
# Once we've made our list of ok words, such that we're only 
# to display specifics
#
# a) xargs
#		Simply, xargs constructs lists of arguments & executes apps on those arguments
#
# b) -a check_words
#		passes the check_words file into xargs
#
# c) -d "\n"
# 		use newline as a separator (one word per line, remember)
#		without this, xargs will puke on any names with apostrophes in them
#
# d) -I{}
#		normally, xargs will put arguments at the end, but we want to put them in the middle
#		so, later on, where you see {}, that's where all the words from check_words have been put
#
# e) grep
#		grep is the app that we want to fire all the check_words into
#
# f) --color=always
#		highlight the word that we've found (so we can see the context of the mis-spelled word)
#
# g) -i
#		case insensitive
#
# h) -r
#		recurse into all subdirectories below the current one
#
# i) -w
#		match whole words only. So Frank, but not the incorrect Frankenstien
#
# j) -n
#		show the line number (so where know WHERE to fix the problem)
#
# k) grep -v check_words
#		since we're showing the filename (grep does that) exclude the file check_words
#		we could maybe have used some combo of find in here, but this works well enough
#
# l) grep '.json'
#		make sure we're only looking in the .json files (since this is the maps section)
