# ---+ Extensions
# ---++ InterwikiPreviewPlugin

# **BOOLEAN**
# Debug flag
$Foswiki::cfg{Plugins}{InterwikiPreviewPlugin}{Debug} = 0;

# **STRING 30**
# Link rules topic name:
$Foswiki::cfg{Plugins}{InterwikiPreviewPlugin}{RulesTopic} = 'InterWikiPreviews';

# **STRING 10**
# Default Cache expiration time. Valid values are those understood by Cache::Cache::set
$Fostwiki::cfg{Plugins}{InterwikiPreviewPlugin}{DefaultCacheExpiry} = '1 day';

# **BOOLEAN**
# Use HTTP Cache-control headers to control internal cache.
$Foswiki::cfg{Plugins}{InterwikiPreviewPlugin}{HttpCacheControl} = 1;

1;

