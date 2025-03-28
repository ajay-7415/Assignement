 {editingUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 w-96 bg-white">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              {error && <p className="text-red-500">{error}</p>}
              <Input placeholder="First Name" value={editData.first_name} onChange={(e) => setEditData({ ...editData, first_name: e.target.value })} className="mb-2" />
              <Input placeholder="Last Name" value={editData.last_name} onChange={(e) => setEditData({ ...editData, last_name: e.target.value })} className="mb-2" />
              <Input placeholder="Email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="mb-4" />
              <Button onClick={handleUpdate} className="w-full mb-2">Update</Button>
              <Button onClick={() => setEditingUser(null)} variant="destructive" className="w-full">Cancel</Button>
            </CardContent>
          </Card>
        </div>
      )}