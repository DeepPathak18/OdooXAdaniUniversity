import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit, Save, X, Camera, Settings, Shield, Award, Globe, Linkedin, Twitter, Instagram, Github } from 'lucide-react';

const GearGuardProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatarFileRef = useRef(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleEdit = () => {
    setFormData({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      phoneNumber: userData?.phoneNumber || '',
      location: userData?.location || '',
      occupation: userData?.occupation || '',
      department: userData?.department || '',
      bio: userData?.bio || '',
      website: userData?.website || '',
      linkedin: userData?.linkedin || '',
      twitter: userData?.twitter || '',
      github: userData?.github || '',
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update profile fields first
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
        }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();

      // If avatar file selected, upload it
      if (avatarFileRef.current && avatarFileRef.current.files && avatarFileRef.current.files[0]) {
        const file = avatarFileRef.current.files[0];
        const form = new FormData();
        form.append('avatar', file);
        const avatarRes = await fetch('/api/profile/avatar', {
          method: 'PUT',
          headers: { ...getAuthHeader() },
          body: form,
        });
        if (!avatarRes.ok) {
          console.warn('Avatar upload failed');
        } else {
          const avatarJson = await avatarRes.json();
          updated.avatar = avatarJson.avatar || updated.avatar;
        }
      }

      // Normalize avatar URL for dev server (backend serves /uploads)
      if (updated.avatar && updated.avatar.startsWith('/uploads')) {
        updated.avatar = `${window.location.protocol}//${window.location.hostname}:5000${updated.avatar}`;
      }
      setAvatarPreview(updated.avatar || avatarPreview);
      setUserData(updated);
      setEditMode(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile/me', { headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      // If avatar is a server-relative path, prefix with backend origin for dev
      if (data.avatar && data.avatar.startsWith('/uploads')) {
        data.avatar = `${window.location.protocol}//${window.location.hostname}:5000${data.avatar}`;
      }
      setUserData(data);
      setAvatarPreview(data.avatar || 'https://images.unsplash.com/photo-1472099645785-5658ab4ff4e?w=400&h=400&fit=crop');

      // load activity
      const actRes = await fetch('/api/profile/activity', { headers: { ...getAuthHeader() } });
      if (actRes.ok) {
        const acts = await actRes.json();
        setActivity(acts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-semibold">Profile updated successfully!</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header with Background */}
        <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl h-48 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Settings className="absolute top-10 left-10 w-32 h-32 animate-spin-slow" />
            <Settings className="absolute bottom-10 right-10 w-24 h-24 animate-spin-reverse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        </div>

        {/* Main Profile Card */}
        <div className="bg-slate-800 rounded-b-2xl shadow-2xl -mt-20 relative border border-slate-700">
          {/* Profile Header */}
          <div className="px-8 pt-24 pb-6 border-b border-slate-700">
            {/* Avatar */}
            <div className="absolute -top-20 left-8">
              <div className="relative group">
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-40 h-40 rounded-2xl border-4 border-slate-800 shadow-2xl object-cover"
                />
                {editMode && (
                  <label className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { handleFileChange(e); avatarFileRef.current = e.target; }}
                      ref={avatarFileRef}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div className="ml-48">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {loading ? 'Loading...' : `${userData?.firstName || ''} ${userData?.lastName || ''}`}
                </h1>
                <div className="flex items-center gap-4 text-slate-400 mb-3">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    @{userData?.username || (userData?.email ? userData.email.split('@')[0] : '')}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {userData?.occupation || ''}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30">
                    Pro Member
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                    Verified
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!editMode ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-400" />
                  About
                </h2>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-slate-300 leading-relaxed">{userData?.bio}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <p className="text-white font-medium">{userData?.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Phone Number</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <p className="text-white font-medium">{userData?.phoneNumber || userData?.phone || '-'}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Location</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <p className="text-white font-medium">{userData?.location || ''}</p>
                    )}
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">Occupation</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <p className="text-white font-medium">{userData?.occupation || ''}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-400" />
                  Social Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Website */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </label>
                    {editMode ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <a href={userData?.website} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                        {userData?.website}
                      </a>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="username"
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <p className="text-white font-medium">{userData?.linkedin || ''}</p>
                    )}
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        placeholder="@username"
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <p className="text-white font-medium">{userData?.twitter || ''}</p>
                    )}
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="username"
                        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                      />
                    ) : (
                      <p className="text-white font-medium">{userData?.github || ''}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Equipment Tracked</span>
                    <span className="text-2xl font-bold text-orange-400">{userData?.stats?.equipment ?? '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Maintenance Done</span>
                    <span className="text-2xl font-bold text-green-400">{userData?.stats?.maintenance ?? '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Uptime Rate</span>
                    <span className="text-2xl font-bold text-blue-400">{userData?.stats?.uptime ?? '-'}</span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4">Account Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-slate-400">Member Since</p>
                      <p className="font-medium">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Shield className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-slate-400">Account Status</p>
                      <p className="font-medium text-green-400">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <User className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-slate-400">Department</p>
                      <p className="font-medium">{userData?.department || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {activity.length === 0 && <p className="text-slate-400">No recent activity</p>}
                  {activity.map((act) => (
                    <div key={act._id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${act.activityType === 'profile_update' ? 'bg-orange-400' : 'bg-blue-400'}`} />
                      <div>
                        <p className="text-white text-sm">{act.description}</p>
                        <p className="text-slate-400 text-xs">{new Date(act.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 15s linear infinite; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default GearGuardProfile;