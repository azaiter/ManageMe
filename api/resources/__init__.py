from importlib import import_module
from common import settings
from common import util as managemeutil
dbEngineName = str("common."+settings.dbEngineFileName)
dbengine = import_module(dbEngineName)